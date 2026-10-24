/**
 * The first-party referral context, shared by the browser tracker (`aff.js`,
 * `referalli/browser`) and the server kits (`@referalli/next`,
 * `@referalli/express`): what it is, how a landing URL updates it, and how it
 * is stored in a cookie on the merchant's own domain. Isomorphic and
 * dependency-free.
 */

/** Cookie (and localStorage key) holding the context. A wire name shared with every `aff.js` install; don't change it. */
export const REFERRAL_COOKIE = 'referalli_ctx';
/**
 * The pre-rename name of the same context. The browser tracker (`aff.js`,
 * `referalli/browser`) writes the context under BOTH names, with the same
 * value, attributes and expiry, and reads either.
 *
 * Why: Atlas's built-in Referalli connector (`context_cookie` default) and
 * Cookie Munch's declaration preset for us (still under the old brand name) still read `referally_ctx`
 * (Atlas ATL-B01, Cookie Munch CMU-B08), so without the twin every new
 * visitor reaches an Atlas sign-up unattributed.
 *
 * TODO(legacy-ctx): drop the legacy name (stop writing it, keep reading it for
 * one cookie window) once Atlas's connector and Cookie Munch's preset read
 * `referalli_ctx`.
 */
export const LEGACY_REFERRAL_COOKIE = 'referally_ctx';
/** Every name the context is written and read under, current first. */
export const REFERRAL_COOKIE_NAMES: readonly string[] = [REFERRAL_COOKIE, LEGACY_REFERRAL_COOKIE];
/** Query parameters that carry a partner's referral code, in priority order. */
export const REFERRAL_PARAMS: readonly string[] = ['via', 'ref', 'aff'];
/** Query parameter carrying a click id from a Referalli redirect link (`/go/...`). */
export const CLICK_ID_PARAM = 'ref_click_id';
export const DEFAULT_COOKIE_DAYS = 60;
const DAY_MS = 86_400_000;

export interface ReferralContext {
  /** This browser's anonymous id (`a_…`). */
  anonId: string;
  /** The partner's referral code from `?via=` / `?ref=` / `?aff=`. */
  code: string | null;
  /** The click id from a redirect link. */
  clickId: string | null;
  /** When the context was first created (epoch ms). */
  ts: number;
}

/** The stored shape: the context plus when it expires (epoch ms). */
export type StoredReferral = ReferralContext & { exp?: number };

export interface MergeOptions {
  now?: number;
  /** Lifetime, 1–400 days. Default 60. */
  cookieDays?: number;
  /** Keep an unexpired first referral instead of replacing it. */
  firstTouch?: boolean;
  randomId?: () => string;
}

export const clampDays = (days: number | undefined): number => Math.max(1, Math.min(400, Math.round(days ?? DEFAULT_COOKIE_DAYS)));

/** A fresh anonymous id: `a_` + 20 random base-36 characters. */
export function newAnonId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const c = (globalThis as { crypto?: { getRandomValues?: (a: Uint8Array) => Uint8Array } }).crypto;
  const bytes = new Uint8Array(20);
  if (c?.getRandomValues) c.getRandomValues(bytes);
  else for (let i = 0; i < 20; i++) bytes[i] = Math.floor(Math.random() * 256);
  let out = 'a_';
  for (const b of bytes) out += chars[b % chars.length];
  return out;
}

/** The referral a URL carries: the first of `params` that is set, and `ref_click_id`. */
export function referralFromUrl(url: string | URL, params: readonly string[] = REFERRAL_PARAMS): { code: string | null; clickId: string | null } {
  let u: URL;
  try {
    u = typeof url === 'string' ? new URL(url, 'http://localhost') : url;
  } catch {
    return { code: null, clickId: null };
  }
  let code: string | null = null;
  for (const p of params) {
    const v = u.searchParams.get(p);
    if (v) {
      code = v.slice(0, 120);
      break;
    }
  }
  const clickId = u.searchParams.get(CLICK_ID_PARAM)?.slice(0, 80) || null;
  return { code, clickId };
}

/** Parse a stored context (the cookie's or localStorage's value, URI-encoded or not). Expired or malformed → null. */
export function parseReferral(raw: string | null | undefined, now: number = Date.now()): StoredReferral | null {
  if (!raw) return null;
  let text = raw;
  try {
    if (raw.startsWith('%7B') || raw.startsWith('%7b')) text = decodeURIComponent(raw);
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(text) as StoredReferral;
    if (!parsed || typeof parsed.anonId !== 'string') return null;
    if (parsed.exp && parsed.exp < now) return null;
    return {
      anonId: parsed.anonId,
      code: typeof parsed.code === 'string' ? parsed.code : null,
      clickId: typeof parsed.clickId === 'string' ? parsed.clickId : null,
      ts: typeof parsed.ts === 'number' ? parsed.ts : now,
      ...(typeof parsed.exp === 'number' ? { exp: parsed.exp } : {}),
    };
  } catch {
    return null;
  }
}

/**
 * The context from a `Cookie` request header. `names` are tried in order
 * (default: `REFERRAL_COOKIE_NAMES`, the current name then the legacy one);
 * add an older cookie name to keep reading contexts saved under it.
 */
export function referralFromCookieHeader(
  cookieHeader: string | null | undefined,
  now: number = Date.now(),
  names: readonly string[] = REFERRAL_COOKIE_NAMES,
): StoredReferral | null {
  if (!cookieHeader) return null;
  const jar = new Map<string, string>();
  for (const part of cookieHeader.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) jar.set(part.slice(0, i).trim(), part.slice(i + 1).trim());
  }
  for (const name of names) {
    const raw = jar.get(name);
    if (raw === undefined) continue;
    try {
      const ctx = parseReferral(decodeURIComponent(raw), now);
      if (ctx) return ctx;
    } catch {
      /* malformed: try the next name */
    }
  }
  return null;
}

/**
 * The context after a page view: a new referral in the URL replaces the
 * stored one (unless `firstTouch` keeps an unexpired one), and a referral
 * restarts the expiry window. Same rules as `aff.js`.
 */
export function mergeReferral(stored: StoredReferral | null, fromUrl: { code: string | null; clickId: string | null }, opts: MergeOptions = {}): StoredReferral {
  const now = opts.now ?? Date.now();
  const days = clampDays(opts.cookieDays);
  const referred = Boolean(fromUrl.code || fromUrl.clickId);
  const keep = Boolean(opts.firstTouch && (stored?.code || stored?.clickId));
  return {
    anonId: stored?.anonId ?? (opts.randomId ?? newAnonId)(),
    code: keep ? (stored?.code ?? null) : (fromUrl.code ?? stored?.code ?? null),
    clickId: keep ? (stored?.clickId ?? null) : (fromUrl.clickId ?? stored?.clickId ?? null),
    ts: stored?.ts ?? now,
    exp: keep && stored?.exp ? stored.exp : referred || !stored?.exp ? now + days * DAY_MS : stored.exp,
  };
}

export interface CookieOptions {
  cookieDays?: number;
  /** Share with subdomains, e.g. `.example.com`. */
  domain?: string;
  /** Default true. Turn off only for plain-http local development. */
  secure?: boolean;
}

/**
 * A `Set-Cookie` header value for the context. Not HttpOnly on purpose: the
 * browser tracker reads the same cookie.
 */
export function serializeReferralCookie(ctx: StoredReferral, opts: CookieOptions = {}): string {
  const days = clampDays(opts.cookieDays);
  const domain = opts.domain && /^\.?[a-z0-9.-]+$/i.test(opts.domain) ? `; Domain=${opts.domain}` : '';
  const secure = opts.secure === false ? '' : '; Secure';
  return `${REFERRAL_COOKIE}=${encodeURIComponent(JSON.stringify(ctx))}; Path=/; Max-Age=${days * 86_400}; SameSite=Lax${domain}${secure}`;
}

/**
 * `Set-Cookie` values for the context under every name: `referalli_ctx` and
 * its legacy twin `referally_ctx`, same value, attributes and expiry (see
 * LEGACY_REFERRAL_COOKIE). Server kits append each one.
 */
export function serializeReferralCookies(ctx: StoredReferral, opts: CookieOptions = {}): string[] {
  const value = serializeReferralCookie(ctx, opts);
  const tail = value.slice(REFERRAL_COOKIE.length);
  return REFERRAL_COOKIE_NAMES.map((name) => `${name}${tail}`);
}

/** `Set-Cookie` values that delete the context under every name (consent denied or withdrawn). */
export function clearReferralCookies(opts: Pick<CookieOptions, 'domain' | 'secure'> = {}): string[] {
  const domain = opts.domain && /^\.?[a-z0-9.-]+$/i.test(opts.domain) ? `; Domain=${opts.domain}` : '';
  const secure = opts.secure === false ? '' : '; Secure';
  return REFERRAL_COOKIE_NAMES.map((name) => `${name}=; Path=/; Max-Age=0; SameSite=Lax${domain}${secure}`);
}

/** Fields for `associate` (server-side attribution at signup) from a context. */
export function associateFields(ctx: ReferralContext | null | undefined): { anonId?: string; referralToken?: string; couponCode?: string } {
  if (!ctx) return {};
  return {
    ...(ctx.anonId ? { anonId: ctx.anonId } : {}),
    ...(ctx.clickId ? { referralToken: ctx.clickId } : {}),
    ...(ctx.code ? { couponCode: ctx.code } : {}),
  };
}

/** SHA-256 hex of a normalised (trimmed, lower-cased) email, for `emailHash` (WebCrypto). */
export async function hashEmail(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
