/**
 * `@referalli/next`: Referalli for Next.js server code.
 *
 *  - `getReferral()` reads the visitor's referral in server components,
 *    route handlers and server actions (the cookie the middleware or the
 *    browser tracker set).
 *  - `attributeSignup()` attributes a new user at signup (server action).
 *  - `verifyWebhook(req)` / `createWebhookHandler()` for App Router webhook routes.
 *
 * The middleware lives in `@referalli/next/middleware` (edge-safe).
 */
import { associateFields, hashEmail, parseReferral, REFERRAL_COOKIE_NAMES, referralFromCookieHeader, type ReferralContext } from 'referalli/attribution';
import { webhooks, WebhookVerificationError, type VerifyOptions, type WebhookEvent, type WebhookEventOf, type WebhookTopic } from 'referalli';

export { captureReferral, referalliMiddleware, type CaptureOptions, type ConsentState } from './middleware.js';
export type { ReferralContext } from 'referalli/attribution';

const view = (s: ReturnType<typeof parseReferral>): ReferralContext | null =>
  s ? { anonId: s.anonId, code: s.code, clickId: s.clickId, ts: s.ts } : null;

/** The visitor's referral, from `next/headers` cookies (server components, route handlers, server actions). */
export async function getReferral(): Promise<ReferralContext | null> {
  const { cookies } = await import('next/headers.js');
  // `next/headers.js`: Next has no exports map, so ESM needs the file name. Next 15 returns a promise; 13/14 return the store (awaiting it is harmless).
  const store = await cookies();
  // Either name: `referalli_ctx`, or its legacy twin `referally_ctx`.
  for (const name of REFERRAL_COOKIE_NAMES) {
    const ctx = parseReferral(store.get(name)?.value);
    if (ctx) return view(ctx);
  }
  return null;
}

/** The referral from any `Request` (Pages Router API routes, edge handlers, tests). */
export function getReferralFromRequest(req: Pick<Request, 'headers'>): ReferralContext | null {
  return view(referralFromCookieHeader(req.headers.get('cookie')));
}

export interface WebhookOptions extends VerifyOptions {
  /** Your endpoint's signing secret (`whsec_…`); pass two while rotating. */
  secret: string | string[];
}

/**
 * Verify an App Router webhook request and return the typed event. Throws
 * `WebhookVerificationError` when the signature or timestamp is wrong.
 *
 *   export async function POST(req: Request) {
 *     const event = await verifyWebhook(req, { secret: process.env.REFERALLI_WEBHOOK_SECRET! });
 *     ...
 *     return Response.json({ received: true });
 *   }
 */
export async function verifyWebhook<T = WebhookEvent>(req: Request, opts: WebhookOptions): Promise<T> {
  const { secret, ...verify } = opts;
  const body = new Uint8Array(await req.arrayBuffer());
  return webhooks.constructEvent<T>(body, req.headers, secret, verify);
}

export type WebhookHandlers = { [K in WebhookTopic]?: (event: WebhookEventOf<K>) => unknown };

/**
 * A complete webhook route: verifies, dispatches by topic, answers 400 on a
 * bad signature and 200 otherwise (a handler that throws answers 500, so
 * Referalli retries the delivery).
 *
 *   export const POST = createWebhookHandler({
 *     secret: process.env.REFERALLI_WEBHOOK_SECRET!,
 *     on: { 'referral.created': async (event) => { ... } },
 *   });
 */
export function createWebhookHandler(opts: WebhookOptions & { on?: WebhookHandlers; onEvent?: (event: WebhookEvent) => unknown }): (req: Request) => Promise<Response> {
  return async (req) => {
    let event: WebhookEvent;
    try {
      event = await verifyWebhook<WebhookEvent>(req, opts);
    } catch (err) {
      if (err instanceof WebhookVerificationError) return Response.json({ error: err.message, reason: err.reason }, { status: 400 });
      return Response.json({ error: 'invalid webhook body' }, { status: 400 });
    }
    const handler = (opts.on as Record<string, ((e: WebhookEvent) => unknown) | undefined> | undefined)?.[event.topic];
    await handler?.(event);
    await opts.onEvent?.(event);
    return Response.json({ received: true });
  };
}

/** Anything with `associate`: a `Referalli` client. */
export interface Associates {
  associate(input: { programId: string; customerRef: string; anonId?: string; referralToken?: string; couponCode?: string; emailHash?: string; idempotencyKey?: string }): Promise<unknown>;
}

export interface AttributeSignupInput {
  /** A server-side `Referalli` client (with your `rk_` key). */
  client: Associates;
  programId: string;
  /** Your id for the new customer (the same one your billing provider sees). */
  customerRef: string;
  /** Hashed before it is sent; lets Referalli match an invite by email. */
  email?: string;
  /** Default: the cookie via `next/headers`. */
  referral?: ReferralContext | null;
  idempotencyKey?: string;
}

/**
 * Attribute a new user to the partner who referred them. Call it from your
 * signup server action or route handler. Best-effort: resolves to null (and
 * never throws) when there is nothing to attribute or the call fails.
 */
export async function attributeSignup(input: AttributeSignupInput): Promise<unknown> {
  try {
    const referral = input.referral === undefined ? await getReferral() : input.referral;
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
