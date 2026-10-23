/**
 * Mobile-app attribution client (works in React Native and any JS mobile runtime;
 * the native iOS/Android SDKs wrap the same HTTP calls).
 *
 * Flow:
 *   1. On first launch, capture `ref_click_id` from the deep link if present
 *      (Android: Play Install Referrer; iOS: Universal Link). If absent, call
 *      `resolveDeferred()` to recover it + the destination by device fingerprint.
 *   2. After signup, call `attributeInstall(customerRef, clickId)`.
 *   3. In-app purchases are NOT reported from the app: send the receipt to your
 *      backend, validate it, then call `ReferalliClient.trackMobilePurchase(...)`
 *      there with your API key. (The app only holds the public tracking token,
 *      which can't be trusted to create commissions.)
 */
export interface MobileClientOptions {
  /** Base URL of the Referalli API (e.g. https://track.yourapp.com). */
  endpoint: string;
  /** Your org's public tracking token. */
  trackingToken: string;
  /** The program these installs belong to. */
  programId: string;
  fetchImpl?: typeof fetch;
}

export function createMobileClient(opts: MobileClientOptions) {
  const f = opts.fetchImpl ?? fetch;
  const base = `${opts.endpoint}/t/${opts.trackingToken}/mobile`;

  return {
    /** Deferred deep link: recover the click id + destination by fingerprint. */
    async resolveDeferred(): Promise<{ matched: boolean; clickId?: string; destination?: string; code?: string }> {
      const res = await f(`${base}/resolve`);
      return res.json() as Promise<{ matched: boolean; clickId?: string; destination?: string; code?: string }>;
    },
    /** Attribute a newly-signed-up user to the referring partner. */
    async attributeInstall(customerRef: string, clickId?: string, deviceId?: string) {
      const res = await f(`${base}/install`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ programId: opts.programId, customerRef, clickId, deviceId }),
      });
      return res.json() as Promise<{ attributed: boolean; referralId: string | null; partnerId: string | null }>;
    },
  };
}
