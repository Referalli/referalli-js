/**
 * The consent port: how the browser tracker (`aff.js`, `referalli/browser`)
 * learns whether the visitor allows the referral context to be stored.
 *
 * Each adapter reads one consent-management platform (CMP) through that
 * vendor's documented browser API. One state machine (gate.ts) turns the
 * adapter's answer into what the tracker may do:
 *
 *   unknown  nothing stored, no beacon; the referral stays in memory, so
 *            `getReferral()` / `signupMetadata()` still attribute a sign-up
 *   granted  `referalli_ctx` (and its legacy twin) written, visit beacon sent
 *            with consent evidence
 *   denied   storage cleared within one tick, nothing sent, referral dropped
 *
 * Adapter factories and the gate are SELF-CONTAINED functions: the served
 * `aff.js` (served.ts) inlines their source text, so they may only use their
 * parameters and browser globals, never an import or a module-level helper.
 * `test/consent/conformance.ts` runs every adapter through the same cases in
 * both the module build and the served script.
 */

/** `unknown` means no decision yet (or no readable CMP). It is never "declined". */
export type ConsentState = 'granted' | 'denied' | 'unknown';

/**
 * Adapters `auto` tries, in this order. The merchant's own `referalliConsent`
 * hook wins, then vendor CMPs (their own category model), then the IAB
 * frameworks and Google Consent Mode, which many CMPs also feed.
 */
export const AUTO_ORDER = [
  'custom',
  'cookiemunch',
  'onetrust',
  'cookiebot',
  'usercentrics',
  'didomi',
  'osano',
  'termly',
  'tcf',
  'gpp',
  'gcm',
] as const;

export type ConsentAdapterId = (typeof AUTO_ORDER)[number] | 'none';
export const CONSENT_ADAPTER_IDS: readonly ConsentAdapterId[] = [...AUTO_ORDER, 'none'];

/**
 * `auto`: the first CMP detected, in `AUTO_ORDER`. `none`: always granted
 * (the tracker's behaviour before consent support; only for sites that need
 * no opt-in). `pending`: unknown until the page calls `aff.consent(true|false)`.
 */
export type ConsentMode = 'auto' | 'none' | 'pending' | ConsentAdapterId;
export const CONSENT_MODES: readonly ConsentMode[] = ['auto', 'pending', ...CONSENT_ADAPTER_IDS];

export interface ConsentEvidence {
  /** The adapter that decided (`onetrust`, `tcf`, …), `custom` for `aff.consent()`, `none`, or `no-cmp` for auto's fallback. */
  provider: string;
  state: ConsentState;
  /** ISO time the state was read. */
  at: string;
  /** The CMP's consent record id, when it exposes one. */
  stamp?: string;
  tcString?: string;
  gppString?: string;
  /** Purposes, categories or groups the CMP reported as allowed. */
  purposes?: string[];
}

export interface ConsentConfig {
  mode: ConsentMode;
  /** Adapter-specific category, group, purpose or service; each adapter has a default. */
  category?: string;
  /** IAB TCF vendor id; when set, TCF requires that vendor's consent instead of publisher purposes 7/9. */
  tcfVendorId?: number;
  /** Google Consent Mode signal to follow. Default `ad_storage`. */
  gcmSignal?: 'ad_storage' | 'analytics_storage';
  /** `auto` with no CMP found: `persist` behaves as granted, `memory` stays unknown. */
  noCmp: 'persist' | 'memory';
  /** How long to wait for a late CMP before `auto` gives up. Default 3000, at most 10000. */
  waitMs?: number;
}

/** What a merchant passes to `initSnippet` / `createTracker`: any subset, mode defaulting to `none`. */
export type ConsentOptions = Partial<ConsentConfig> | ConsentMode;

/** One adapter bound to a window. Every method may throw; the gate reads a throw as `unknown`. */
export interface ConsentReader {
  /** Is this CMP's API (or its stub) on the page? */
  detect(): boolean;
  state(cfg: ConsentConfig): ConsentState;
  /** Calls `cb` whenever the CMP reports a load, a decision or a change. Returns an unsubscribe. */
  subscribe(cfg: ConsentConfig, cb: () => void): () => void;
  /** Extra evidence fields (stamp, tcString, gppString, purposes). */
  evidence(cfg: ConsentConfig): Omit<ConsentEvidence, 'provider' | 'state' | 'at'> | null;
}

/** Self-contained: inlined into aff.js by its source text. */
export type ConsentAdapterFactory = (w: any) => ConsentReader;

export interface ConsentSource {
  readonly id: ConsentAdapterId;
  readonly name: string;
  /** What the adapter reads when no `category` is configured. */
  readonly defaultCategory: string | null;
  readonly factory: ConsentAdapterFactory;
  readonly status: 'ga' | 'beta';
  /** Referalli's page for this CMP. */
  readonly docsUrl: string;
  /** The vendor's API documentation the adapter follows. */
  readonly vendorDocsUrl: string;
  /** Health (docs/PORTS.md): cheap, read-only, never throws. */
  readonly check: (cfg?: Partial<ConsentConfig>) => Promise<PortCheck>;
}

export interface PortCheck {
  ok: boolean;
  detail: string;
  fix?: string;
}

/**
 * Every consent adapter's `check()`. The CMP lives in the visitor's browser,
 * so there is nothing to probe from a server: the health signal is the
 * consent evidence each visit carries (its `provider` and `state`). This says
 * what the adapter will read with the given config.
 */
export async function browserCheck(source: Pick<ConsentSource, 'name' | 'defaultCategory'>, cfg?: Partial<ConsentConfig>): Promise<PortCheck> {
  const what = cfg?.category ?? source.defaultCategory;
  return {
    ok: true,
    detail: `${source.name} is read in the visitor's browser${what ? ` (${what})` : ''}; each visit's consent evidence shows its answer.`,
  };
}

/** Normalise merchant options into a full config (mode `none` when absent: the pre-consent behaviour). */
export function consentConfig(opts: ConsentOptions | undefined | null): ConsentConfig {
  const o: Partial<ConsentConfig> = typeof opts === 'string' ? { mode: opts } : (opts ?? {});
  const mode = o.mode && CONSENT_MODES.includes(o.mode) ? o.mode : 'none';
  const waitMs = typeof o.waitMs === 'number' && o.waitMs >= 0 ? Math.min(10_000, Math.round(o.waitMs)) : 3000;
  return {
    mode,
    ...(typeof o.category === 'string' && o.category ? { category: o.category.slice(0, 80) } : {}),
    ...(typeof o.tcfVendorId === 'number' && o.tcfVendorId > 0 ? { tcfVendorId: Math.round(o.tcfVendorId) } : {}),
    ...(o.gcmSignal === 'analytics_storage' || o.gcmSignal === 'ad_storage' ? { gcmSignal: o.gcmSignal } : {}),
    noCmp: o.noCmp === 'memory' ? 'memory' : 'persist',
    waitMs,
  };
}
