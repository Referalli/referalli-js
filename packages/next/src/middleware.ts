/**
 * `@referalli/next/middleware`: capture `?via=` / `?ref=` / `?aff=` (and
 * `ref_click_id`) into a first-party cookie on your own domain, before any
 * page renders. Edge-safe.
 *
 *   // middleware.ts
 *   export { referalliMiddleware as middleware } from '@referalli/next/middleware';
 *   // or, with options / your own middleware:
 *   import { captureReferral } from '@referalli/next/middleware';
 *   export function middleware(req: NextRequest) {
 *     return captureReferral(req, NextResponse.next(), { cookieDomain: '.example.com' });
 *   }
 */
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server.js';
import {
  mergeReferral,
  REFERRAL_COOKIE,
  REFERRAL_PARAMS,
  referralFromUrl,
  parseReferral,
  serializeReferralCookie,
  type StoredReferral,
} from 'referalli/attribution';

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
}

type Req = Pick<NextRequest, 'nextUrl' | 'headers' | 'cookies'>;

/**
 * Update the referral cookie on `res` when the request URL carries a
 * referral. Returns `res`. Requests without one are left alone.
 */
export function captureReferral<R extends NextResponse>(req: Req, res: R, opts: CaptureOptions = {}, event?: Pick<NextFetchEvent, 'waitUntil'>): R {
  const fromUrl = referralFromUrl(req.nextUrl, opts.params ?? REFERRAL_PARAMS);
  if (!fromUrl.code && !fromUrl.clickId) return res;
  const stored = parseReferral(req.cookies.get(REFERRAL_COOKIE)?.value);
  const ctx: StoredReferral = mergeReferral(stored, fromUrl, { cookieDays: opts.cookieDays, firstTouch: opts.firstTouch });
  res.headers.append(
    'set-cookie',
    serializeReferralCookie(ctx, { cookieDays: opts.cookieDays, domain: opts.cookieDomain, secure: req.nextUrl.protocol === 'https:' }),
  );
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
