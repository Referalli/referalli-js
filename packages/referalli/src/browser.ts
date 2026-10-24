/**
 * `referalli/browser`: the referral tracker for your own pages. It reads
 * `?via=` / `?ref=` / `?aff=` and `ref_click_id` from the landing URL, keeps
 * the context in a first-party cookie (and localStorage) on your domain,
 * records the visit, and attributes the visitor when they sign up.
 *
 *   import { createTracker } from 'referalli/browser';
 *   const tracker = await createTracker({ publishableKey: 'tk_...' });
 *   // after signup:
 *   await tracker.trackSignup({ customerRef: user.id, email: user.email });
 *
 * Consent: pass `consent: 'auto'` (or a CMP id such as `'onetrust'`) and
 * nothing is stored or sent until the visitor's CMP grants it; the referral
 * still reaches `signupMetadata()` from memory. Without a CMP, call
 * `tracker.consent(true | false)`. The default, `'none'`, always stores.
 *
 * Only your public tracking token goes in the browser, never an `rk_` key.
 * Tree-shakeable and dependency-free.
 */
import { hashEmail, parseReferral, REFERRAL_COOKIE_NAMES, referralFromCookieHeader, type ReferralContext, type StoredReferral } from './attribution.js';
import { initSnippet, type AffApi, type SnippetConfig } from './snippet.js';

export {
  associateFields,
  hashEmail,
  mergeReferral,
  parseReferral,
  LEGACY_REFERRAL_COOKIE,
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_NAMES,
  REFERRAL_PARAMS,
  referralFromCookieHeader,
  referralFromUrl,
  serializeReferralCookie,
  serializeReferralCookies,
  clearReferralCookies,
  type ReferralContext,
  type StoredReferral,
} from './attribution.js';
export type { AffApi } from './snippet.js';
export {
  AUTO_ORDER,
  CONSENT_ADAPTER_IDS,
  type ConsentAdapterId,
  type ConsentConfig,
  type ConsentEvidence,
  type ConsentMode,
  type ConsentOptions,
  type ConsentState,
} from './consent/port.js';

export interface TrackerOptions extends Omit<SnippetConfig, 'token' | 'baseUrl'> {
  /** Your org's public tracking token (Settings → Tracking). Safe to ship to browsers. */
  publishableKey: string;
  /** Default `https://referalli.com` (or your tracking domain). */
  baseUrl?: string;
}

export interface Tracker extends AffApi {
  /** Attribute this visitor to the customer they just became (hashes `email` in the browser). */
  trackSignup(input: { customerRef?: string; email?: string }): Promise<void>;
}

/** Start tracking this page view. Resolves once the visit beacon is sent (it never rejects for network errors). */
export async function createTracker(opts: TrackerOptions): Promise<Tracker> {
  if (typeof window === 'undefined') throw new Error('referalli/browser: createTracker runs in the browser only');
  const { publishableKey, baseUrl, ...rest } = opts;
  let storage: Storage | null = null;
  try {
    storage = window.localStorage;
  } catch {
    /* blocked (privacy mode) */
  }
  const api = await initSnippet(
    {
      win: window,
      doc: document,
      storage,
      fetchFn: (url, init) => fetch(url, { ...init, keepalive: true }),
      consentWindow: window,
    },
    { ...rest, token: publishableKey, baseUrl: (baseUrl ?? 'https://referalli.com').replace(/\/+$/, '') },
  );
  return {
    ...api,
    trackSignup: async ({ customerRef, email }) =>
      api.identify({ customerRef, emailHash: email ? await hashEmail(email) : undefined }),
  };
}

/** The stored referral context without starting a tracker (no network). Null on the server or when there is none. */
export function getReferral(): ReferralContext | null {
  if (typeof document === 'undefined') return null;
  // Either name: `referalli_ctx`, or its legacy twin `referally_ctx`.
  let stored: StoredReferral | null = null;
  for (const key of REFERRAL_COOKIE_NAMES) {
    try {
      stored = parseReferral(window.localStorage.getItem(key));
    } catch {
      /* storage may be blocked */
    }
    if (stored) break;
  }
  stored ??= referralFromCookieHeader(document.cookie);
  if (!stored) return null;
  return { anonId: stored.anonId, code: stored.code, clickId: stored.clickId, ts: stored.ts };
}
