import { browserCheck, type ConsentSource } from '../port.js';

/**
 * IAB TCF v2.2: `__tcfapi('addEventListener', 2, cb)`. Granted when purpose 1
 * (store/access) and purpose 7 or 9 are consented (publisher or global
 * purpose consent), or, when `tcfVendorId` is set, purpose 1 plus that
 * vendor's consent. `gdprApplies: false` is granted. Evidence: `tcString`.
 */
export const tcf: ConsentSource = {
  id: 'tcf',
  name: 'IAB TCF v2.2',
  defaultCategory: 'purposes 1 + 7/9',
  status: 'ga',
  docsUrl: 'https://referalli.com/docs/tracking-consent#tcf',
  vendorDocsUrl: 'https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework',
  check: (cfg) => browserCheck(tcf, cfg),
  factory: function tcfConsent(w: any) {
    let data: any = null;
    let listening = false;
    const subs: Array<() => void> = [];
    function listen(): void {
      if (listening || typeof w.__tcfapi !== 'function') return;
      listening = true;
      w.__tcfapi('addEventListener', 2, function (tc: any, ok: boolean) {
        if (ok === false || !tc) return;
        data = tc;
        const list = subs.slice();
        for (let i = 0; i < list.length; i++) (list[i] as () => void)();
      });
    }
    function has(n: number): boolean {
      const pur = (data && data.purpose && data.purpose.consents) || {};
      const pub = (data && data.publisher && data.publisher.consents) || {};
      return !!(pur[n] || pub[n]);
    }
    return {
      detect(): boolean {
        return typeof w.__tcfapi === 'function';
      },
      state(cfg) {
        listen();
        if (!data) return 'unknown';
        if (data.gdprApplies === false) return 'granted';
        if (data.eventStatus !== 'tcloaded' && data.eventStatus !== 'useractioncomplete') return 'unknown';
        if (cfg.tcfVendorId) {
          const vc = (data.vendor && data.vendor.consents) || {};
          return has(1) && vc[cfg.tcfVendorId] ? 'granted' : 'denied';
        }
        return has(1) && (has(7) || has(9)) ? 'granted' : 'denied';
      },
      subscribe(_cfg, cb) {
        subs.push(cb);
        listen();
        return function () {
          const i = subs.indexOf(cb);
          if (i >= 0) subs.splice(i, 1);
        };
      },
      evidence() {
        if (!data) return null;
        const purposes: string[] = [];
        for (let n = 1; n <= 11; n++) if (has(n)) purposes.push(String(n));
        return { tcString: typeof data.tcString === 'string' ? data.tcString : undefined, purposes };
      },
    };
  },
};
