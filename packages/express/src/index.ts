/**
 * `@referalli/express`: Referalli middleware for Express 4/5 (and any
 * Node `http` server with the same `(req, res, next)` shape).
 *
 *   app.post('/webhooks/referalli', referalliWebhook({ secret: process.env.REFERALLI_WEBHOOK_SECRET! }), (req, res) => {
 *     const event = req.referalliEvent!;
 *     res.json({ received: true });
 *   });
 *   app.use(referalliAttribution()); // req.referral on every request
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { webhooks, WebhookVerificationError, type VerifyOptions, type WebhookEvent } from 'referalli';
import {
  associateFields,
  hashEmail,
  mergeReferral,
  REFERRAL_PARAMS,
  referralFromCookieHeader,
  referralFromUrl,
  serializeReferralCookie,
  type ReferralContext,
} from 'referalli/attribution';

export type { ReferralContext } from 'referalli/attribution';

type Next = (err?: unknown) => void;
type Req = IncomingMessage & {
  body?: unknown;
  rawBody?: unknown;
  originalUrl?: string;
  protocol?: string;
  secure?: boolean;
  referalliEvent?: WebhookEvent;
  referral?: ReferralContext | null;
};
type Res = ServerResponse;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** The verified webhook event (set by `referalliWebhook`). */
      referalliEvent?: WebhookEvent;
      /** The visitor's referral context (set by `referalliAttribution`). */
      referral?: ReferralContext | null;
    }
  }
}

export interface WebhookMiddlewareOptions extends VerifyOptions {
  /** Your endpoint's signing secret (`whsec_…`); pass two while rotating. */
  secret: string | string[];
  /** Largest body accepted when the middleware reads the stream itself. Default 1 MB. */
  limit?: number;
}

function readStream(req: IncomingMessage, limit: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    let size = 0;
    req.on('data', (c: Uint8Array) => {
      size += c.length;
      if (size > limit) {
        reject(Object.assign(new Error('webhook body too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      const out = new Uint8Array(size);
      let off = 0;
      for (const c of chunks) {
        out.set(c, off);
        off += c.length;
      }
      resolve(out);
    });
    req.on('error', reject);
  });
}

/** The exact bytes Referalli signed: `express.raw()` output, a `rawBody` your parser kept, or the unread stream. */
async function rawBodyOf(req: Req, limit: number): Promise<Uint8Array | string> {
  if (req.rawBody instanceof Uint8Array || typeof req.rawBody === 'string') return req.rawBody;
  if (req.body instanceof Uint8Array || typeof req.body === 'string') return req.body;
  if (req.body !== undefined && req.body !== null && (typeof req.body !== 'object' || Object.keys(req.body).length > 0)) {
    throw new Error(
      'referalliWebhook: the body was already parsed, so the signature cannot be checked. Mount the webhook route before express.json(), or use express.raw({ type: "application/json" }) on it.',
    );
  }
  if (req.readableEnded) throw new Error('referalliWebhook: the request body was already consumed');
  return readStream(req, limit);
}

function send(res: Res, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
}

/**
 * Verify a Referalli webhook delivery. On success `req.referalliEvent` holds
 * the typed event (and `req.body` the parsed JSON); on a bad signature or
 * stale timestamp it answers 400 itself. Handles the raw body for you: mount
 * it before `express.json()` (or after `express.raw()`).
 */
export function referalliWebhook(opts: WebhookMiddlewareOptions): (req: Req, res: Res, next: Next) => void {
  const { secret, limit = 1_000_000, ...verify } = opts;
  return (req, res, next) => {
    void (async () => {
      let raw: Uint8Array | string;
      try {
        raw = await rawBodyOf(req, limit);
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status === 413) return send(res, 413, { error: 'webhook body too large' });
        return next(err);
      }
      try {
        const event = await webhooks.constructEvent<WebhookEvent>(raw, req.headers, secret, verify);
        req.referalliEvent = event;
        req.body = event;
      } catch (err) {
        if (err instanceof WebhookVerificationError) return send(res, 400, { error: err.message, reason: err.reason });
        return send(res, 400, { error: 'invalid webhook body' });
      }
      next();
    })();
  };
}

export interface AttributionOptions {
  /** Query parameters carrying a referral code. Default via, ref, aff. */
  params?: readonly string[];
  /** Cookie lifetime, 1–400 days. Default 60. */
  cookieDays?: number;
  /** Keep the first referral until it expires instead of the latest. */
  firstTouch?: boolean;
  /** Share the cookie with subdomains, e.g. `.example.com`. */
  cookieDomain?: string;
  /** Default: true when the request is HTTPS (`req.secure`, or `x-forwarded-proto` with `trust proxy`). */
  secure?: boolean;
  /** Your public tracking token: also record referral landings server-side (`/t/{token}/visit`). */
  publishableKey?: string;
  /** Default `https://referalli.com`. */
  baseUrl?: string;
  fetch?: typeof fetch;
}

function appendSetCookie(res: Res, value: string): void {
  const prev = res.getHeader('set-cookie');
  const list = prev === undefined ? [] : Array.isArray(prev) ? prev : [String(prev)];
  res.setHeader('set-cookie', [...list, value]);
}

/**
 * Keep the referral context in a first-party cookie: when a request URL
 * carries `?via=` / `?ref=` / `?aff=` or `ref_click_id`, the cookie is set or
 * updated. Every request gets `req.referral` (null when there is none).
 */
export function referalliAttribution(opts: AttributionOptions = {}): (req: Req, res: Res, next: Next) => void {
  return (req, res, next) => {
    const stored = referralFromCookieHeader(req.headers.cookie);
    const url = new URL(req.originalUrl ?? req.url ?? '/', 'http://localhost');
    const fromUrl = referralFromUrl(url, opts.params ?? REFERRAL_PARAMS);
    let ctx = stored;
    if (fromUrl.code || fromUrl.clickId) {
      ctx = mergeReferral(stored, fromUrl, { cookieDays: opts.cookieDays, firstTouch: opts.firstTouch });
      const secure = opts.secure ?? (req.secure === true || req.protocol === 'https');
      appendSetCookie(res, serializeReferralCookie(ctx, { cookieDays: opts.cookieDays, domain: opts.cookieDomain, secure }));
      if (opts.publishableKey) {
        const base = (opts.baseUrl ?? 'https://referalli.com').replace(/\/+$/, '');
        void (opts.fetch ?? fetch)(`${base}/t/${encodeURIComponent(opts.publishableKey)}/visit`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'user-agent': String(req.headers['user-agent'] ?? '') },
          body: JSON.stringify({ anonId: ctx.anonId, code: ctx.code ?? undefined, clickId: ctx.clickId ?? undefined, referer: req.headers.referer }),
        }).catch(() => undefined);
      }
    }
    req.referral = ctx ? { anonId: ctx.anonId, code: ctx.code, clickId: ctx.clickId, ts: ctx.ts } : null;
    next();
  };
}

/** Anything with `associate`: a `Referalli` client. */
export interface Associates {
  associate(input: { programId: string; customerRef: string; anonId?: string; referralToken?: string; couponCode?: string; emailHash?: string; idempotencyKey?: string }): Promise<unknown>;
}

/**
 * Attribute a new user at signup from the request's referral cookie.
 * Best-effort: resolves to null (never throws) when there is nothing to attribute.
 *
 *   app.post('/signup', async (req, res) => {
 *     const user = await createUser(req.body);
 *     await attributeSignup(req, { client: referalli, programId: 'prg_...', customerRef: user.id, email: user.email });
 *   });
 */
export async function attributeSignup(
  req: Pick<Req, 'headers' | 'referral'>,
  input: { client: Associates; programId: string; customerRef: string; email?: string; idempotencyKey?: string },
): Promise<unknown> {
  try {
    const referral = req.referral !== undefined ? req.referral : referralFromCookieHeader(req.headers.cookie);
    const emailHash = input.email ? await hashEmail(input.email) : undefined;
    const fields = associateFields(referral);
    if (!fields.anonId && !fields.referralToken && !fields.couponCode && !emailHash) return null;
    return await input.client.associate({
      programId: input.programId,
      customerRef: input.customerRef,
      ...fields,
      ...(emailHash ? { emailHash } : {}),
      idempotencyKey: input.idempotencyKey ?? `signup:${input.customerRef}`,
    });
  } catch {
    return null;
  }
}
