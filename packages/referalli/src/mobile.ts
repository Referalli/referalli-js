/**
 * Mobile-app attribution client (works in React Native and any JS mobile runtime;
 * the native iOS/Android SDKs wrap the same HTTP calls).
 *
 * Flow:
 *   1. On first launch, capture `ref_click_id` from the deep link if present
 *      (Android: Play Install Referrer; iOS: Universal Link). If absent, call
 *      `resolveDeferred()` to recover it + the destination by device fingerprint.
 *   2. Record the app visit with `trackVisit(anonId, { clickId })`, and after
 *      signup call `identify(anonId, { customerRef })` and
 *      `attributeInstall(customerRef, clickId)`.
 *   3. In-app purchases are NOT reported from the app: send the receipt to your
 *      backend, validate it, then call `ReferalliClient.trackMobilePurchase(...)`
 *      there with your API key. (The app only holds the public tracking token,
 *      which can't be trusted to create commissions.)
 *
 * Every method rejects with `MobileApiError` when the API answers non-2xx
 * (`status` set) or can't be reached (`status: null`).
 */
export interface MobileClientOptions {
  /** Base URL of the Referalli API (e.g. https://track.yourapp.com). */
  endpoint: string;
  /** Your org's public tracking token, or a live publishable key (`rk_pub_…`). */
  trackingToken: string;
  /** The program these installs belong to. */
  programId: string;
  fetchImpl?: typeof fetch;
}

/** A mobile tracking call failed: `status` is the HTTP status, or null for a network error; `code` is the API's error code. */
export class MobileApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
    readonly code: string | null = null,
  ) {
    super(message);
    this.name = 'MobileApiError';
  }
}

export function createMobileClient(opts: MobileClientOptions) {
  const f = opts.fetchImpl ?? fetch;
  const root = `${opts.endpoint.replace(/\/+$/, '')}/t/${encodeURIComponent(opts.trackingToken)}`;
  const base = `${root}/mobile`;

  async function call<T>(url: string, init?: RequestInit): Promise<T> {
    let res: Response;
    try {
      res = await f(url, init);
    } catch (e) {
      throw new MobileApiError(`could not reach Referalli: ${(e as Error).message}`, null);
    }
    const body = (await res.json().catch(() => ({}))) as T & { error?: { code?: string; message?: string } };
    if (!res.ok) {
      const path = new URL(url).pathname;
      throw new MobileApiError(body?.error?.message ?? `Referalli answered ${res.status} for ${path}`, res.status, body?.error?.code ?? null);
    }
    return body;
  }
  const post = <T>(url: string, payload: Record<string, unknown>) =>
    call<T>(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });

  return {
    /** Deferred deep link: recover the click id + destination by fingerprint. */
    async resolveDeferred(): Promise<{ matched: boolean; clickId?: string; destination?: string; code?: string; programId?: string }> {
      return call<{ matched: boolean; clickId?: string; destination?: string; code?: string; programId?: string }>(`${base}/resolve`);
    },
    /** Attribute a newly-signed-up user to the referring partner. */
    async attributeInstall(customerRef: string, clickId?: string, deviceId?: string) {
      return post<{ attributed: boolean; referralId: string | null; partnerId: string | null }>(`${base}/install`, {
        programId: opts.programId,
        customerRef,
        clickId,
        deviceId,
      });
    },
    /** Record an app visit (a referral link opened in the app); returns the click id recorded or echoed. */
    async trackVisit(anonId: string, visit: { code?: string | null; clickId?: string | null; url?: string } = {}): Promise<{ ok: true; clickId: string | null }> {
      return post<{ ok: true; clickId: string | null }>(`${root}/visit`, {
        anonId,
        ...(visit.code ? { code: visit.code } : {}),
        ...(visit.clickId ? { clickId: visit.clickId } : {}),
        ...(visit.url ? { url: visit.url.slice(0, 2048) } : {}),
      });
    },
    /** Tie this install's anonymous id to the customer (or a hashed email). */
    async identify(anonId: string, who: { customerRef?: string; emailHash?: string } = {}): Promise<{ ok: true }> {
      return post<{ ok: true }>(`${root}/identify`, {
        anonId,
        ...(who.customerRef ? { customerRef: who.customerRef } : {}),
        ...(who.emailHash ? { emailHash: who.emailHash } : {}),
      });
    },
  };
}
