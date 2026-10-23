'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { DEFAULT_BASE_URL, useReferalliOptional } from './provider.js';

/**
 * The optional default look. Widgets are unstyled unless you pass `styled`;
 * restyle with the `data-referalli` attributes or these CSS variables:
 * `--referalli-accent`, `--referalli-radius`, `--referalli-border`, `--referalli-font`.
 */
const look = {
  root: { display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--referalli-font, inherit)' },
  input: {
    flex: 1,
    minWidth: 0,
    padding: '8px 10px',
    border: '1px solid var(--referalli-border, #d4d4d8)',
    borderRadius: 'var(--referalli-radius, 8px)',
    font: 'inherit',
  },
  button: {
    padding: '8px 14px',
    border: 0,
    borderRadius: 'var(--referalli-radius, 8px)',
    background: 'var(--referalli-accent, #4f46e5)',
    color: '#fff',
    font: 'inherit',
    cursor: 'pointer',
  },
  card: {
    padding: 20,
    border: '1px solid var(--referalli-border, #e4e4e7)',
    borderRadius: 'var(--referalli-radius, 12px)',
    fontFamily: 'var(--referalli-font, inherit)',
    display: 'grid',
    gap: 10,
  },
} satisfies Record<string, CSSProperties>;

export interface ReferralLinkState {
  url: string;
  copied: boolean;
  /** Whether the Web Share API is available (false during SSR). */
  canShare: boolean;
  copy: () => Promise<boolean>;
  share: () => Promise<boolean>;
}

export interface ReferralLinkProps {
  /** The full referral link (`link.url` from the API or the partner portal). */
  url?: string;
  /** Or a referral code, appended to `destination` as `?via=<code>`. */
  code?: string;
  /** Where a `code` link lands. Default: the current page's origin (or `/` during SSR). */
  destination?: string;
  /** Text for a native share sheet. */
  shareText?: string;
  shareTitle?: string;
  /** Apply the default look. Default false (unstyled). */
  styled?: boolean;
  className?: string;
  copyLabel?: ReactNode;
  copiedLabel?: ReactNode;
  shareLabel?: ReactNode;
  /** Render it yourself: `{(s) => <button onClick={s.copy}>{s.copied ? 'Copied' : s.url}</button>}`. */
  children?: (state: ReferralLinkState) => ReactNode;
}

/** Build a referral link from a code: `https://example.com/pricing?via=CODE`. */
export function referralUrl(code: string, destination: string): string {
  const [path, hash] = destination.split('#', 2) as [string, string | undefined];
  return `${path}${path.includes('?') ? '&' : '?'}via=${encodeURIComponent(code)}${hash !== undefined ? `#${hash}` : ''}`;
}

/** A referral link with copy and share buttons. */
export function ReferralLink(props: ReferralLinkProps): ReactNode {
  const { url: given, code, destination, shareText, shareTitle, styled = false, className, children } = props;
  // The page origin is read after mount so the server and first client render agree.
  const [origin, setOrigin] = useState<string | null>(null);
  const url = given ?? (code ? referralUrl(code, destination ?? `${origin ?? ''}/`) : '');
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    setOrigin(window.location.origin);
    setCanShare(typeof navigator.share === 'function');
    return () => clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async () => {
    if (!url) return false;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return false;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
    return true;
  }, [url]);

  const share = useCallback(async () => {
    if (!url || typeof navigator === 'undefined' || typeof navigator.share !== 'function') return copy();
    try {
      await navigator.share({ url, text: shareText, title: shareTitle });
      return true;
    } catch {
      return false;
    }
  }, [url, shareText, shareTitle, copy]);

  if (children) return children({ url, copied, canShare, copy, share });
  return (
    <div data-referalli="referral-link" data-copied={copied || undefined} className={className} style={styled ? look.root : undefined}>
      <input data-referalli="referral-link-url" readOnly value={url} aria-label="Referral link" onFocus={(e) => e.currentTarget.select()} style={styled ? look.input : undefined} />
      <button type="button" data-referalli="referral-link-copy" onClick={() => void copy()} style={styled ? look.button : undefined}>
        {copied ? (props.copiedLabel ?? 'Copied') : (props.copyLabel ?? 'Copy')}
      </button>
      {canShare ? (
        <button type="button" data-referalli="referral-link-share" onClick={() => void share()} style={styled ? look.button : undefined}>
          {props.shareLabel ?? 'Share'}
        </button>
      ) : null}
    </div>
  );
}

/** A program's public page (`GET /v1/public/programs/{handle}`). */
export interface PublicProgram {
  handle: string;
  programId: string;
  programName: string;
  merchant: string;
  pitch: string;
  autoApprove: boolean;
  cookieWindowDays: number;
  termsMd: string;
  commission: unknown;
  branding: { logoUrl: string | null; theme: unknown };
}

export interface PartnerSignupState {
  program: PublicProgram | null;
  loading: boolean;
  error: Error | null;
  /** Referalli's hosted sign-up for this program (`/join/{handle}`). */
  joinUrl: string;
}

export interface PartnerSignupProps {
  /** The program's public handle. Defaults to the provider's `program`. */
  handle?: string;
  /** Default `https://referalli.com` or the provider's `baseUrl`. */
  baseUrl?: string;
  styled?: boolean;
  className?: string;
  /** Call to action. Default "Become a partner". */
  ctaLabel?: ReactNode;
  /** Open the sign-up in a new tab. Default true. */
  newTab?: boolean;
  children?: (state: PartnerSignupState) => ReactNode;
}

/**
 * "Become a partner": shows a program's pitch and links to its hosted
 * partner sign-up, where the partner creates an account and gets a link.
 */
export function PartnerSignup(props: PartnerSignupProps): ReactNode {
  const ctx = useReferalliOptional();
  const handle = props.handle ?? ctx?.program;
  const baseUrl = (props.baseUrl ?? ctx?.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  const [state, setState] = useState<Omit<PartnerSignupState, 'joinUrl'>>({ program: null, loading: Boolean(handle), error: null });

  useEffect(() => {
    if (!handle) return;
    let cancelled = false;
    setState({ program: null, loading: true, error: null });
    fetch(`${baseUrl}/v1/public/programs/${encodeURIComponent(handle)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 404 ? `program "${handle}" not found` : `HTTP ${res.status}`);
        return (await res.json()) as PublicProgram;
      })
      .then((program) => !cancelled && setState({ program, loading: false, error: null }))
      .catch((error: unknown) => !cancelled && setState({ program: null, loading: false, error: error instanceof Error ? error : new Error(String(error)) }));
    return () => {
      cancelled = true;
    };
  }, [handle, baseUrl]);

  const joinUrl = handle ? `${baseUrl}/join/${encodeURIComponent(handle)}` : '';
  if (props.children) return props.children({ ...state, joinUrl });
  if (!handle) return null;
  const { program, loading, error } = state;
  const s = props.styled ?? false;
  return (
    <div data-referalli="partner-signup" data-loading={loading || undefined} className={props.className} style={s ? look.card : undefined}>
      {program ? (
        <>
          <strong data-referalli="partner-signup-title">{program.programName}</strong>
          {program.pitch ? <p data-referalli="partner-signup-pitch" style={s ? { margin: 0 } : undefined}>{program.pitch}</p> : null}
        </>
      ) : null}
      {error ? <p data-referalli="partner-signup-error" role="alert">{error.message}</p> : null}
      <a
        data-referalli="partner-signup-cta"
        href={joinUrl}
        {...(props.newTab === false ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        style={s ? { ...look.button, textDecoration: 'none', textAlign: 'center' } : undefined}
      >
        {props.ctaLabel ?? 'Become a partner'}
      </a>
    </div>
  );
}

