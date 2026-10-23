/**
 * The original hand-written client, kept for existing integrations. New code
 * should use `Referalli` (every operation, typed, with retries and typed errors).
 */

type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

export interface ReferalliClientOptions {
  apiKey: string;
  /** Default `https://referalli.com`. */
  baseUrl?: string;
  fetchFn?: FetchLike;
  /**
   * The API version to send as `referalli-version`. Defaults to the version
   * this SDK was written against; pass `null` to send none and use the key's
   * pinned version.
   */
  apiVersion?: string | null;
}

/** The API version this SDK speaks (paginated list envelopes). */
export const SDK_API_VERSION = '2026-11-01';

/** One page of a list endpoint (referalli-version 2026-11-01 and later). */
export interface ListPage<T> {
  object: 'list';
  data: T[];
  has_more: boolean;
  next_cursor: string | null;
}

/** One value fact for POST /v1/value/events (amounts in integer minor units). */
export interface ValueEventReport {
  kind: 'payment' | 'refund' | 'credit_granted' | 'credit_redeemed' | 'credit_expired' | 'credit_revoked' | 'cost' | 'adjustment';
  /** Needed: at least one of customerRef, partnerId, partnerExternalRef. */
  customerRef?: string;
  partnerId?: string;
  partnerExternalRef?: string;
  creditGrantId?: string;
  referralId?: string;
  programId?: string;
  productRef?: string;
  currency: string;
  cashMinor?: number;
  creditAppliedMinor?: number;
  discountMinor?: number;
  taxMinor?: number;
  feesMinor?: number;
  costMinor?: number;
  faceMinor?: number;
  /** Your id for this fact; reporting it again is a no-op. */
  externalId: string;
  invoiceRef?: string;
  provider?: string;
  /** ISO 8601 instant or date. */
  occurredAt: string | Date;
  role?: 'referee' | 'referrer';
  metadata?: Record<string, unknown>;
}

export interface ValueEventsResult {
  results: Array<{ index: number; id: string; created: boolean; superseded: string[] }>;
  errors: Array<{ index: number; message: string }>;
}

type Without<K extends keyof ValueEventReport> = Omit<ValueEventReport, 'kind' | K>;
export type ReportPaymentInput = Without<'role' | 'faceMinor' | 'costMinor'>;
export type ReportCreditGrantedInput = Without<'costMinor' | 'cashMinor'> & { role: 'referee' | 'referrer'; faceMinor: number };
export type ReportCreditUsedInput = Without<'role' | 'costMinor'> & { creditAppliedMinor: number };
export type ReportCostInput = Without<'role' | 'faceMinor' | 'cashMinor'> & { costMinor: number };

/** @deprecated Use `Referalli`. */
export class ReferalliClient {
  private readonly fetchFn: FetchLike;

  private readonly version: string | null;

  constructor(private readonly opts: ReferalliClientOptions) {
    this.fetchFn = opts.fetchFn ?? ((url, init) => fetch(url, init));
    this.version = opts.apiVersion === undefined ? SDK_API_VERSION : opts.apiVersion;
  }

  /** One page of a list endpoint. `query` adds filters; `limit` is 1–100. */
  listPage<T = Record<string, unknown>>(
    path: string,
    query: Record<string, string | number | undefined> = {},
  ): Promise<ListPage<T>> {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) if (v !== undefined) qs.set(k, String(v));
    const sep = path.includes('?') ? '&' : '?';
    const q = qs.toString();
    return this.request('GET', q ? `${path}${sep}${q}` : path);
  }

  /**
   * Every item of a list endpoint, fetching pages as you iterate:
   * `for await (const r of client.list('/v1/referrals', { status: 'active' }))`.
   */
  async *list<T = Record<string, unknown>>(
    path: string,
    query: Record<string, string | number | undefined> = {},
  ): AsyncGenerator<T, void, undefined> {
    let cursor: string | undefined;
    do {
      const page = await this.listPage<T>(path, { limit: 100, ...query, starting_after: cursor });
      if (!page || !Array.isArray(page.data)) {
        throw new Error(`referalli api GET ${path} did not return a list page (send referalli-version ${SDK_API_VERSION})`);
      }
      yield* page.data;
      cursor = page.has_more && page.next_cursor ? page.next_cursor : undefined;
    } while (cursor);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await this.fetchFn(`${(this.opts.baseUrl ?? 'https://referalli.com').replace(/\/+$/, '')}${path}`, {
      method,
      headers: {
        authorization: `Bearer ${this.opts.apiKey}`,
        'content-type': 'application/json',
        ...(this.version ? { 'referalli-version': this.version } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`referalli api ${method} ${path} failed (${res.status}): ${text}`);
    }
    return res.json() as Promise<T>;
  }

  associate(input: {
    programId: string;
    customerRef: string;
    anonId?: string;
    referralToken?: string;
    couponCode?: string;
    emailHash?: string;
    ip?: string;
    ua?: string;
    idempotencyKey?: string;
  }): Promise<{ referral: Record<string, unknown> | null }> {
    return this.request('POST', '/v1/referrals/associate', input);
  }

  trackClick(input: {
    programId: string;
    partnerId: string;
    linkId?: string;
    url?: string;
    anonId?: string;
    ip?: string;
    ua?: string;
  }): Promise<{ clickId: string }> {
    return this.request('POST', '/v1/track/events', { type: 'click', url: '', ...input });
  }

  /**
   * Report an in-app purchase (or refund) for commissioning. Call it from your
   * server after validating the App Store / Play receipt — never from the app.
   * Idempotent per `eventId`.
   */
  trackMobilePurchase(input: {
    eventId: string;
    customerRef: string;
    amountMinor: number;
    currency?: string;
    productRef?: string;
    type?: 'purchase' | 'refund';
  }): Promise<{ conversions: number; linesCreated: number; reversals: number }> {
    return this.request('POST', '/v1/mobile/purchases', { currency: 'usd', type: 'purchase', ...input });
  }

  /**
   * Report value facts (payments, credit, costs) directly. Up to 500 per call; each
   * is idempotent by `externalId`, and invalid ones come back in `errors` while the
   * rest are recorded.
   */
  reportValueEvents(events: ValueEventReport[]): Promise<ValueEventsResult> {
    return this.request('POST', '/v1/value/events', { events });
  }

  /** A payment, with the cash received and any store credit or discount that paid part of it. */
  reportPayment(input: ReportPaymentInput): Promise<ValueEventsResult> {
    return this.reportValueEvents([{ kind: 'payment', ...input }]);
  }

  /** Credit you granted to a customer (`referee`) or a partner (`referrer`). */
  reportCreditGranted(input: ReportCreditGrantedInput): Promise<ValueEventsResult> {
    return this.reportValueEvents([{ kind: 'credit_granted', ...input }]);
  }

  /** Credit used up against a purchase. */
  reportCreditUsed(input: ReportCreditUsedInput): Promise<ValueEventsResult> {
    return this.reportValueEvents([{ kind: 'credit_redeemed', ...input }]);
  }

  /** What serving a customer or partner cost you. */
  reportCost(input: ReportCostInput): Promise<ValueEventsResult> {
    return this.reportValueEvents([{ kind: 'cost', ...input }]);
  }

  listReferrals(query: { programId?: string; partnerId?: string; status?: string } = {}): Promise<
    Array<Record<string, unknown>>
  > {
    const qs = new URLSearchParams(
      Object.entries(query).filter(([, v]) => v !== undefined) as [string, string][],
    ).toString();
    return this.request('GET', `/v1/referrals${qs ? `?${qs}` : ''}`);
  }
}

/**
 * Auth.js / NextAuth adapter. Callback-based auth platforms run inside the
 * merchant's own server, so instead of a webhook we hand them a `createUser`
 * event handler that attributes each new user. The referral context comes from
 * the client (window.aff.getReferral()) — pass a resolver that reads it from
 * wherever you stashed it (a cookie, the user's metadata, the pending sign-up).
 *
 *   import { Referalli, referalliAuthEvents } from "referalli";
 *   const events = referalliAuthEvents(new Referalli(), {
 *     programId: "prg_...",
 *     getReferral: () => JSON.parse(cookies().get("referalli_ctx")?.value ?? "{}"),
 *   });
 *   // Auth.js config: events: { createUser: events.createUser }
 */
export interface AuthEventsOptions {
  programId: string;
  getReferral?: (user: { id?: string; email?: string }) => {
    anonId?: string;
    clickId?: string;
    code?: string;
    coupon?: string;
  } | null | undefined;
}

/** Anything with an `associate` call: `Referalli` or `ReferalliClient`. */
export interface Associates {
  associate(input: {
    programId: string;
    customerRef: string;
    anonId?: string;
    referralToken?: string;
    couponCode?: string;
    emailHash?: string;
    idempotencyKey?: string;
  }): Promise<unknown>;
}

export function referalliAuthEvents(client: Associates, opts: AuthEventsOptions) {
  return {
    /** Wire into Auth.js `events.createUser` (or call from any signup handler). */
    createUser: async (message: { user: { id?: string; email?: string } }): Promise<void> => {
      const user = message.user;
      const customerRef = user.id ?? user.email;
      if (!customerRef) return;
      const ref = opts.getReferral?.(user) ?? {};
      const emailHash = user.email ? await sha256Hex(user.email.toLowerCase()) : undefined;
      if (!ref.anonId && !ref.clickId && !ref.coupon && !emailHash) return;
      await client
        .associate({
          programId: opts.programId,
          customerRef,
          anonId: ref.anonId,
          referralToken: ref.clickId,
          couponCode: ref.coupon,
          emailHash,
          idempotencyKey: `authjs:${customerRef}`,
        })
        .catch(() => {
          /* attribution is best-effort; never block signup */
        });
    },
  };
}

async function sha256Hex(input: string): Promise<string> {
  // Works in Node 18+ and edge runtimes via the Web Crypto API.
  const data = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
