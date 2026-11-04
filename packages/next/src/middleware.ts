/**
 * `@referalli/next/middleware`: capture `?via=` / `?ref=` / `?aff=` (and
 * `ref_click_id`) into a first-party cookie on your own domain, before any
 * page renders. Edge-safe.
 *
 *   // middleware.ts: wait for the visitor's Cookie Munch decision
 *   export const middleware = referalliMiddleware({ consent: 'cookiemunch' });
 *   // or, with options / your own middleware:
 *   import { captureReferral } from '@referalli/next/middleware';
 *   export function middleware(req: NextRequest) {
 *     return captureReferral(req, NextResponse.next(), { cookieDomain: '.example.com' });
 *   }
 */
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server.js';
import {
  clearReferralCookies,
  mergeReferral,
  REFERRAL_COOKIE_NAMES,
  REFERRAL_PARAMS,
  referralFromUrl,
  parseReferral,
  serializeReferralCookies,
  type StoredReferral,
} from 'referalli/attribution';

/** The visitor's consent for the referral cookie, as your CMP reports it server-side. */
export type ConsentState = 'granted' | 'denied' | 'unknown';

export interface CaptureOptions {
  /** Query parameters carrying a referral code. Default via, ref, aff. */
  params?: readonly string[];
  /** Cookie lifetime, 1–400 days. Default 60. */
  cookieDays?: number;
  /** Keep the first referral until it expires instead of the latest (first_click programs). */
  firstTouch?: boolean;
  /** Share the cookie with subdomains, e.g. `.example.com`. */
  cookieDomain?: string;
  /**
   * Your public tracking token. When set, a referral landing is also
   * recorded server-side (`/t/{token}/visit`), so it counts even if the page
   * never loads the browser tracker.
   */
  publishableKey?: string;
  /** Default `https://referalli.com`. */
  baseUrl?: string;
  fetch?: typeof fetch;
  /**
   * The visitor's consent for the referral cookie. `'cookiemunch'` (or
   * `{ cookiemunch: { category } }`; default category `referrals`, falling
   * back to `marketing`) reads Cookie Munch's `CookieMunch` cookie; a
   * function reads your own CMP's cookie. On `unknown` nothing is set or sent:
   * the middleware can't see a decision made on the page, so a visitor who
   * accepts after landing is captured by the browser kit
   * (`<ReferalliProvider consent="cookiemunch" persist="referral-only">`), which
   * keeps the referral in memory and saves and records it on consent. On
   * `denied` the context is deleted and nothing is sent.
   * Default: always granted (only for sites that need no opt-in).
   */
  consent?: 'cookiemunch' | { cookiemunch: { category?: string } } | ((req: Req) => ConsentState);
}

/** The name of Cookie Munch's consent cookie (cookiemunch.net/docs/consent-cookie). */
export const COOKIE_MUNCH_COOKIE = 'CookieMunch';

/** Cookie Munch's cookie value: URL-encoded JSON, plain JSON, or Cookiebot's relaxed literal (`{stamp:'…',marketing:true}`). */
function parseCookieMunch(raw: string | undefined): Record<string, any> | null {
  if (!raw) return null;
  let s = raw;
  try {
    s = decodeURIComponent(raw);
  } catch {
    // already decoded
  }
  for (const text of [s, s.replace(/'/g, '"').replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')]) {
    try {
      const v: unknown = JSON.parse(text);
      if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, any>;
    } catch {
      // try the next encoding
    }
  }
  return null;
}

/**
 * Port of aff.js's Cookie Munch adapter (`referalli` src/consent/adapters/cookiemunch.ts),
 * reading the cookie instead of `window.CookieMunch.consent`: no cookie is no decision yet;
 * custom categories sit under `custom` in the cookie, standard ones at the top level.
 * shortcut: `ver` is not compared with the site's `consent.version` (the server can't see the
 * site config); the embed deletes an aged-out cookie on the visitor's next page view.
 */
function readCookieMunch(req: Req, category: string | undefined): { state: ConsentState; stamp?: string } {
  const c = parseCookieMunch(req.cookies.get(COOKIE_MUNCH_COOKIE)?.value);
  if (!c) return { state: 'unknown' };
  const cat = category || 'referrals';
  let v: unknown = typeof c[cat] === 'boolean' ? c[cat] : c.custom?.[cat];
  if (typeof v !== 'boolean' && !category) v = c.marketing;
  return { state: v === true ? 'granted' : 'denied', ...(c.stamp ? { stamp: String(c.stamp) } : {}) };
}

function readConsent(req: Req, opt: CaptureOptions['consent']): { provider: string; state: ConsentState; stamp?: string } {
  if (!opt) return { provider: 'none', state: 'granted' };
  const provider = typeof opt === 'function' ? 'server' : 'cookiemunch';
  try {
    if (typeof opt === 'function') return { provider, state: opt(req) };
    return { provider, ...readCookieMunch(req, opt === 'cookiemunch' ? undefined : opt.cookiemunch?.category) };
  } catch {
    return { provider, state: 'unknown' };
  }
}

type Req = Pick<NextRequest, 'nextUrl' | 'headers' | 'cookies'>;

/**
 * Update the referral cookie on `res` when the request URL carries a
 * referral. Returns `res`. Requests without one are left alone.
 */
export function captureReferral<R extends NextResponse>(req: Req, res: R, opts: CaptureOptions = {}, event?: Pick<NextFetchEvent, 'waitUntil'>): R {
  const secure = req.nextUrl.protocol === 'https:';
  const evidence = readConsent(req, opts.consent);
  const consent = evidence.state;
  if (consent === 'denied') {
    if (REFERRAL_COOKIE_NAMES.some((n) => req.cookies.get(n))) {
      for (const c of clearReferralCookies({ domain: opts.cookieDomain, secure })) res.headers.append('set-cookie', c);
    }
    return res;
  }
  // Undecided: nothing set or sent. The browser kit records the landing when the visitor decides (once, not twice).
  if (consent !== 'granted') return res;
  const fromUrl = referralFromUrl(req.nextUrl, opts.params ?? REFERRAL_PARAMS);
  if (!fromUrl.code && !fromUrl.clickId) return res;
  let stored: StoredReferral | null = null;
  for (const name of REFERRAL_COOKIE_NAMES) stored ??= parseReferral(req.cookies.get(name)?.value);
  const ctx: StoredReferral = mergeReferral(stored, fromUrl, { cookieDays: opts.cookieDays, firstTouch: opts.firstTouch });
  // `referalli_ctx` and its legacy twin `referally_ctx`, as the browser tracker writes them.
  for (const c of serializeReferralCookies(ctx, { cookieDays: opts.cookieDays, domain: opts.cookieDomain, secure })) {
    res.headers.append('set-cookie', c);
  }
  if (opts.publishableKey) {
    const base = (opts.baseUrl ?? 'https://referalli.com').replace(/\/+$/, '');
    const send = (opts.fetch ?? fetch)(`${base}/t/${encodeURIComponent(opts.publishableKey)}/visit`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': req.headers.get('user-agent') ?? '' },
      body: JSON.stringify({
        anonId: ctx.anonId,
        code: ctx.code ?? undefined,
        clickId: ctx.clickId ?? undefined,
        url: req.nextUrl.href,
        referer: req.headers.get('referer') ?? undefined,
        ...(opts.consent ? { consent: { ...evidence, at: new Date().toISOString() } } : {}),
      }),
    }).then(
      () => undefined,
      () => undefined,
    );
    event?.waitUntil(send);
  }
  return res;
}

/** A ready-made middleware: `export const middleware = referalliMiddleware({ ... })`, or export it as-is. */
export function referalliMiddleware(opts?: CaptureOptions): (req: NextRequest, event?: NextFetchEvent) => NextResponse;
export function referalliMiddleware(req: NextRequest, event?: NextFetchEvent): NextResponse;
export function referalliMiddleware(
  arg?: CaptureOptions | NextRequest,
  event?: NextFetchEvent,
): NextResponse | ((req: NextRequest, event?: NextFetchEvent) => NextResponse) {
  if (arg && 'nextUrl' in arg) return captureReferral(arg, NextResponse.next(), {}, event);
  const opts = arg ?? {};
  return (req, ev) => captureReferral(req, NextResponse.next(), opts, ev);
}
