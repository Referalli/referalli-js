import {
  clampDays,
  mergeReferral,
  newAnonId,
  parseReferral,
  REFERRAL_COOKIE_NAMES,
  REFERRAL_PARAMS,
  referralFromUrl,
  type ReferralContext,
  type StoredReferral,
} from './attribution.js';
import { consentGate } from './consent/gate.js';
import { AUTO_ORDER, consentConfig, type ConsentEvidence, type ConsentOptions, type ConsentState } from './consent/port.js';
import { adapterFactories } from './consent/registry.js';

/**
 * Browser tracking snippet, written against an injected environment so the
 * logic is unit-testable without a DOM. The served `aff.js` (see served.ts)
 * wraps this with the real window/document/fetch.
 */

export interface SnippetEnv {
  win: { location: { href: string } };
  doc: { cookie: string };
  storage: {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem?(key: string): void;
  } | null;
  fetchFn: (url: string, init: { method: string; headers: Record<string, string>; body?: string }) => Promise<unknown>;
  randomId?: () => string;
  now?: () => number;
  /**
   * The window the consent adapters read CMP globals from and set timers on
   * (`window` in a browser). Default `globalThis`.
   */
  consentWindow?: unknown;
}

export interface SnippetConfig {
  token: string;
  baseUrl: string;
  /** Query params that carry a referral code; default via/ref/aff. */
  params?: string[];
  /**
   * `referral-only`: store and send nothing unless the URL carries a referral
   * (use it before consent). Default `always`.
   */
  persist?: 'always' | 'referral-only';
  /** How long the context is kept, 1–400 days. Default 60. */
  cookieDays?: number;
  /** Keep the first referral instead of replacing it (first_click programs). */
  firstTouch?: boolean;
  /** Share the cookie with subdomains, e.g. `.app.com`. */
  cookieDomain?: string;
  /** Older storage/cookie names to read a saved context from (it is re-saved under the current name). */
  legacyKeys?: string[];
  /**
   * How visitor consent is read before anything is stored or sent: a mode
   * (`'auto'`, `'pending'`, `'onetrust'`, …) or a full config. Default
   * `'none'` (always store, the behaviour before consent support). Until
   * consent is granted the context is kept in memory only.
   */
  consent?: ConsentOptions;
}

export type { ReferralContext } from './attribution.js';

export interface AffApi {
  getReferral(): ReferralContext;
  /** Referral context keyed for auth-platform signup metadata. */
  signupMetadata(): { referalli_click_id?: string; referalli_anon_id: string; referalli_coupon?: string };
  identify(opts: { customerRef?: string; emailHash?: string }): Promise<void>;
  /** Delete the stored context (consent withdrawn) and stop sending. */
  forget(): void;
  /** The push path for pages without a supported CMP. Idempotent; the latest signal wins. */
  consent(granted: boolean): void;
  consentState(): ConsentState;
  /** The evidence the visit beacon carried; pass it to `associate` as `consent`. Null before a decision. */
  consentEvidence(): ConsentEvidence | null;
  /** The adapter in use (`onetrust`, …), `auto` while looking, `no-cmp`, `none` or `pending`. */
  readonly consentMode: string;
}

/**
 * Every key the context is written under: `referalli_ctx` and its legacy twin
 * `referally_ctx` (see LEGACY_REFERRAL_COOKIE for when the twin can go).
 */
const WRITE_KEYS = REFERRAL_COOKIE_NAMES;

/** The stored shape: the context plus when it expires. */
type StoredContext = StoredReferral;

function readCookie(doc: { cookie: string }, key: string): string | null {
  for (const part of doc.cookie.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === key) return decodeURIComponent(rest.join('='));
  }
  return null;
}

function loadContext(env: SnippetEnv, now: number, legacyKeys: readonly string[] = []): StoredContext | null {
  for (const key of new Set([...WRITE_KEYS, ...legacyKeys])) {
    let raw: string | null = null;
    try {
      raw = env.storage?.getItem(key) ?? null;
    } catch {
      /* storage may be unavailable */
    }
    raw ??= readCookie(env.doc, key);
    const ctx = parseReferral(raw, now);
    if (ctx) return ctx;
  }
  return null;
}

function cookieFlags(env: SnippetEnv, config: SnippetConfig): string {
  const domain = config.cookieDomain && /^\.?[a-z0-9.-]+$/i.test(config.cookieDomain) ? `; domain=${config.cookieDomain}` : '';
  const secure = env.win.location.href.startsWith('https:') ? '; Secure' : '';
  return `; path=/; SameSite=Lax${domain}${secure}`;
}

function persistContext(env: SnippetEnv, config: SnippetConfig, ctx: StoredContext, days: number): void {
  const raw = JSON.stringify(ctx);
  // Same value, attributes and expiry under every name.
  const tail = `=${encodeURIComponent(raw)}; max-age=${days * 86_400}${cookieFlags(env, config)}`;
  for (const key of WRITE_KEYS) {
    try {
      env.storage?.setItem(key, raw);
    } catch {
      /* storage may be unavailable */
    }
    try {
      env.doc.cookie = `${key}${tail}`;
    } catch {
      /* cookie write may be blocked */
    }
  }
}

export async function initSnippet(env: SnippetEnv, config: SnippetConfig): Promise<AffApi> {
  const now = env.now?.() ?? Date.now();
  const days = clampDays(config.cookieDays);
  const { code, clickId: clickIdParam } = referralFromUrl(env.win.location.href, config.params ?? REFERRAL_PARAMS);
  const referred = Boolean(code || clickIdParam);

  const stored = loadContext(env, now, config.legacyKeys);
  // First touch keeps a stored referral until it expires.
  const ctx: StoredContext = mergeReferral(stored, { code, clickId: clickIdParam }, {
    now,
    cookieDays: days,
    firstTouch: config.firstTouch,
    randomId: env.randomId ?? newAnonId,
  });
  const active = config.persist !== 'referral-only' || referred;
  let gone = false;
  let dropped = false;
  let sent: Promise<unknown> | null = null;
  let state: ConsentState = 'unknown';
  let pendingIdentify: { customerRef?: string; emailHash?: string } | null = null;

  const post = (path: string, body: Record<string, unknown>) =>
    gone || dropped
      ? Promise.resolve()
      : env.fetchFn(`${config.baseUrl}${path}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });

  const clearStorage = () => {
    for (const key of new Set([...WRITE_KEYS, ...(config.legacyKeys ?? [])])) {
      try {
        env.storage?.removeItem?.(key);
      } catch {
        /* storage may be unavailable */
      }
      try {
        env.doc.cookie = `${key}=; max-age=0${cookieFlags(env, config)}`;
      } catch {
        /* cookie write may be blocked */
      }
    }
  };

  const sendIdentify = (opts: { customerRef?: string; emailHash?: string }) =>
    post(`/t/${config.token}/identify`, {
      anonId: ctx.anonId,
      customerRef: opts.customerRef,
      emailHash: opts.emailHash,
    }).catch(() => {});

  const onConsent = (next: ConsentState, evidence: ConsentEvidence | null) => {
    state = next;
    if (next === 'granted') {
      dropped = false;
      if (active && !gone) {
        persistContext(env, config, ctx, days);
        // Server-side visit record: the session exists even if all storage is wiped.
        sent ??= post(`/t/${config.token}/visit`, {
          anonId: ctx.anonId,
          code: ctx.code ?? undefined,
          clickId: ctx.clickId ?? undefined,
          url: env.win.location.href,
          ...(evidence ? { consent: evidence } : {}),
        }).catch(() => {});
      }
      if (pendingIdentify) {
        const queued = pendingIdentify;
        pendingIdentify = null;
        void sendIdentify(queued);
      }
    } else if (next === 'denied') {
      clearStorage();
      dropped = true;
      pendingIdentify = null;
    }
  };

  const consentCfg = consentConfig(config.consent);
  const gate = consentGate(env.consentWindow ?? globalThis, consentCfg, adapterFactories(AUTO_ORDER), AUTO_ORDER, onConsent);
  gate.start();
  if (sent) await sent;

  const view = (): ReferralContext =>
    gone || dropped ? { anonId: '', code: null, clickId: null, ts: 0 } : { anonId: ctx.anonId, code: ctx.code, clickId: ctx.clickId, ts: ctx.ts };

  return {
    getReferral: view,
    /**
     * Referral context shaped for an auth platform's signup metadata. Spread
     * into Clerk's `unsafeMetadata`, Supabase's `data`, or an Auth.js signup
     * so the connector can attribute the new user server-side.
     */
    signupMetadata: () => {
      const v = view();
      return {
        referalli_click_id: v.clickId ?? undefined,
        referalli_anon_id: v.anonId,
        referalli_coupon: v.code ?? undefined,
      };
    },
    identify: async (opts) => {
      if (gone || dropped || (!active && !stored)) return;
      // Before a decision, hold it: it is sent once consent is granted.
      if (state !== 'granted') {
        pendingIdentify = opts;
        return;
      }
      await sendIdentify(opts);
    },
    forget: () => {
      gone = true;
      gate.stop();
      clearStorage();
    },
    consent: (granted) => gate.push(granted === true),
    consentState: () => state,
    consentEvidence: () => gate.evidence(),
    get consentMode() {
      return gate.mode();
    },
  };
}
