'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createTracker, getReferral, type ReferralContext, type Tracker, type TrackerOptions } from 'referalli/browser';

export const DEFAULT_BASE_URL = 'https://referalli.com';

/** What the code in a referral resolves to (`GET /t/{token}/codes/{code}`): only a first name, never an email. */
export interface ReferralPartner {
  partnerDisplayName: string;
  refereeReward: {
    kind: string;
    bps?: number;
    amountMinor?: number;
    capMinor?: number;
    currency: string;
    on: string;
  } | null;
}

export interface ReferralState extends Partial<ReferralContext> {
  /** The partner the code belongs to, once resolved (null when unknown or invalid). */
  partner: ReferralPartner | null;
  /** True once the browser state has been read (always false during SSR). */
  ready: boolean;
}

interface ContextValue {
  publishableKey: string;
  program?: string;
  baseUrl: string;
  referral: ReferralState;
  tracker: Tracker | null;
  whenReady: () => Promise<Tracker | null>;
}

const ReferalliContext = createContext<ContextValue | null>(null);

export interface ReferalliProviderProps extends Omit<TrackerOptions, 'publishableKey' | 'baseUrl'> {
  /** Your org's public tracking token (safe in the browser; never an `rk_` key). */
  publishableKey: string;
  /** Your program (id `prg_…` or public handle), passed to the widgets. */
  program?: string;
  /** Default `https://referalli.com`, or your tracking domain. */
  baseUrl?: string;
  /**
   * Start the tracker (record the visit, keep the cookie). Default true. To
   * follow the site's CMP instead of toggling this, pass `consent: 'auto'`
   * (or a CMP id): nothing is stored until the visitor grants it.
   */
  track?: boolean;
  /** Look up the partner behind a referral code ("Invited by Dana"). Default true. */
  resolvePartner?: boolean;
  /** A referral read on the server (`getReferral()` from `@referalli/next`) to render before hydration. */
  initialReferral?: ReferralContext | null;
  children?: ReactNode;
}

/**
 * Starts the browser tracker and shares the referral context with the hooks
 * and widgets below it. SSR-safe: nothing touches `window` until mounted.
 */
export function ReferalliProvider(props: ReferalliProviderProps): ReactNode {
  const { publishableKey, program, baseUrl: base, track = true, resolvePartner = true, initialReferral = null, children, ...trackerOpts } = props;
  const baseUrl = (base ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  const [tracker, setTracker] = useState<Tracker | null>(null);
  const [referral, setReferral] = useState<ReferralState>(() => ({ ...(initialReferral ?? {}), partner: null, ready: false }));
  const waiters = useRef<Array<(t: Tracker | null) => void>>([]);
  const optsKey = JSON.stringify(trackerOpts);

  useEffect(() => {
    let cancelled = false;
    const settle = (t: Tracker | null) => {
      for (const w of waiters.current.splice(0)) w(t);
    };
    if (!track) {
      const stored = getReferral();
      setReferral((r) => ({ ...r, ...(stored ?? {}), ready: true }));
      settle(null);
      return;
    }
    createTracker({ ...(JSON.parse(optsKey) as Omit<TrackerOptions, 'publishableKey'>), publishableKey, baseUrl })
      .then((t) => {
        if (cancelled) return;
        setTracker(t);
        const ctx = t.getReferral();
        setReferral((r) => ({ ...r, anonId: ctx.anonId || undefined, code: ctx.code, clickId: ctx.clickId, ts: ctx.ts, ready: true }));
        settle(t);
      })
      .catch(() => {
        if (cancelled) return;
        setReferral((r) => ({ ...r, ready: true }));
        settle(null);
      });
    return () => {
      cancelled = true;
    };
  }, [publishableKey, baseUrl, track, optsKey]);

  const code = referral.code;
  useEffect(() => {
    if (!resolvePartner || !code) return;
    let cancelled = false;
    fetch(`${baseUrl}/t/${encodeURIComponent(publishableKey)}/codes/${encodeURIComponent(code)}`)
      .then((res) => (res.ok ? (res.json() as Promise<{ valid?: boolean } & ReferralPartner>) : null))
      .then((body) => {
        if (cancelled || !body?.valid) return;
        setReferral((r) => ({ ...r, partner: { partnerDisplayName: body.partnerDisplayName, refereeReward: body.refereeReward ?? null } }));
      })
      .catch(() => {
        /* the lookup is cosmetic */
      });
    return () => {
      cancelled = true;
    };
  }, [resolvePartner, code, baseUrl, publishableKey]);

  const whenReady = useCallback(
    () => (tracker || referral.ready ? Promise.resolve(tracker) : new Promise<Tracker | null>((resolve) => waiters.current.push(resolve))),
    [tracker, referral.ready],
  );

  const value = useMemo<ContextValue>(
    () => ({ publishableKey, program, baseUrl, referral, tracker, whenReady }),
    [publishableKey, program, baseUrl, referral, tracker, whenReady],
  );
  return <ReferalliContext.Provider value={value}>{children}</ReferalliContext.Provider>;
}

/** The provider's context, or null outside `<ReferalliProvider>`. */
export function useReferalliOptional(): ContextValue | null {
  return useContext(ReferalliContext);
}

/** The provider's context; throws outside `<ReferalliProvider>`. */
export function useReferalli(): ContextValue {
  const ctx = useContext(ReferalliContext);
  if (!ctx) throw new Error('useReferalli: wrap your app in <ReferalliProvider publishableKey="...">');
  return ctx;
}

/**
 * The current visitor's referral: `code` (the partner's referral code),
 * `clickId`, `anonId`, and `partner` (their first name and the referee reward)
 * once resolved. Empty during SSR and on the first client render.
 */
export function useReferral(): ReferralState {
  return useReferalli().referral;
}

/**
 * A function that attributes the visitor to the customer they just became.
 * Call it right after signup; it waits for the tracker if needed and never throws.
 *
 *   const trackSignup = useTrackSignup();
 *   await trackSignup({ customerRef: user.id, email: user.email });
 */
export function useTrackSignup(): (input: { customerRef?: string; email?: string }) => Promise<void> {
  const { whenReady } = useReferalli();
  return useCallback(
    async (input) => {
      try {
        const t = await whenReady();
        await t?.trackSignup(input);
      } catch {
        /* attribution is best-effort; never block signup */
      }
    },
    [whenReady],
  );
}
