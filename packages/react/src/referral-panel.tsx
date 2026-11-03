'use client';

import { useEffect, useRef, useState, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { DEFAULT_BASE_URL, useReferalliOptional } from './provider.js';

export const REFERRAL_WIDGET_TAG = 'referalli-referral-widget';

/** Returns the signed-in user's session JWT, or nothing when signed out. */
export type GetAuthToken = () => string | null | undefined | Promise<string | null | undefined>;

/** The `<referalli-referral-widget>` element the served `widget.js` defines. */
export interface ReferralWidgetElement extends HTMLElement {
  getAuthToken?: GetAuthToken;
}

/** Attributes of `<referalli-referral-widget>` for hand-written JSX. */
export type ReferralWidgetAttributes = DetailedHTMLProps<HTMLAttributes<ReferralWidgetElement>, ReferralWidgetElement> & {
  program?: string;
  auth?: string;
  token?: string;
  'token-url'?: string;
  lang?: string;
};

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'referalli-referral-widget': ReferralWidgetAttributes;
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'referalli-referral-widget': ReferralWidgetElement;
  }
}

export interface ReferralPanelProps {
  /** The program (`prg_…`): the panel exchanges the user's session JWT at `POST /v1/widget/session`. */
  programId?: string;
  /** Where the widget reads the JWT: `atlas`, `clerk`, `firebase` (their browser SDK globals), or pass `getAuthToken`. */
  auth?: 'atlas' | 'clerk' | 'firebase' | 'custom' | (string & {});
  /** Your auth SDK's session token, for any provider (Supabase, Auth0, Cognito, WorkOS…). */
  getAuthToken?: GetAuthToken;
  /** A widget token your backend minted (`POST /v1/widget/tokens`). */
  token?: string;
  /** A same-origin route of yours returning `{ "token": "…" }`. */
  tokenUrl?: string;
  lang?: string;
  /** Your public tracking token (`tk_…`). Defaults to `<ReferalliProvider publishableKey>`. */
  trackingToken?: string;
  /** Defaults to the provider's `baseUrl`, then https://referalli.com. */
  baseUrl?: string;
  className?: string;
  /** The widget script loaded and the element is in the page. */
  onReady?: (element: ReferralWidgetElement) => void;
  /** The widget script failed to load, or no tracking token was given. */
  onError?: (error: Error) => void;
}

const loads = new Map<string, Promise<void>>();

function loadWidgetScript(src: string): Promise<void> {
  if (customElements.get(REFERRAL_WIDGET_TAG)) return Promise.resolve();
  let p = loads.get(src);
  if (!p) {
    p = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loads.delete(src); // let a later mount retry
        s.remove();
        reject(new Error(`Referalli: could not load ${src}`));
      };
      document.head.appendChild(s);
    });
    loads.set(src, p);
  }
  return p;
}

/**
 * The signed-in customer's referral panel (link, code, share buttons, progress):
 *
 *   <ReferralPanel programId="prg_…" auth="atlas" />
 *
 * Renders nothing on the server; on the client it loads `widget.js` once and
 * mounts `<referalli-referral-widget>`.
 */
export function ReferralPanel(props: ReferralPanelProps) {
  const { programId, auth, token, tokenUrl, lang, className } = props;
  const ctx = useReferalliOptional();
  const trackingToken = props.trackingToken ?? ctx?.publishableKey;
  const baseUrl = (props.baseUrl ?? ctx?.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  const hasGetter = Boolean(props.getAuthToken);
  const latest = useRef(props);
  latest.current = props;
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const box = host.current;
    if (!mounted || !box) return;
    if (!trackingToken) {
      latest.current.onError?.(new Error('ReferralPanel: pass trackingToken or wrap it in <ReferalliProvider publishableKey>'));
      return;
    }
    let live = true;
    let el: ReferralWidgetElement | null = null;
    loadWidgetScript(`${baseUrl}/t/${encodeURIComponent(trackingToken)}/widget.js`).then(
      () => {
        if (!live) return;
        el = document.createElement(REFERRAL_WIDGET_TAG);
        const attrs = { program: programId, auth, token, 'token-url': tokenUrl, lang };
        for (const [k, v] of Object.entries(attrs)) if (v) el.setAttribute(k, v);
        // The element reads attributes once, on connect, so the getter goes on before it joins the page.
        if (hasGetter) el.getAuthToken = () => latest.current.getAuthToken?.();
        box.appendChild(el);
        latest.current.onReady?.(el);
      },
      (e: Error) => {
        if (live) latest.current.onError?.(e);
      },
    );
    return () => {
      live = false;
      el?.remove();
    };
  }, [mounted, trackingToken, baseUrl, programId, auth, token, tokenUrl, lang, hasGetter]);

  return mounted ? <div ref={host} className={className} data-referalli="referral-panel" /> : null;
}
