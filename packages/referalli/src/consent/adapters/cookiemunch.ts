import { browserCheck, type ConsentSource } from '../port.js';

/**
 * Cookie Munch: `window.CookieMunch.{hasResponse, consent}` and the
 * `CookieMunchOnChange` window event (Cookie Munch guide R4: read the
 * snapshot, never the event payload). Category `referrals`, falling back to
 * `marketing` when the site declares no `referrals` category.
 */
export const cookiemunch: ConsentSource = {
  id: 'cookiemunch',
  name: 'Cookie Munch',
  defaultCategory: 'referrals',
  status: 'beta',
  docsUrl: 'https://referalli.com/docs/tracking-consent#cookie-munch',
  vendorDocsUrl: 'https://cookiemunch.net/docs',
  check: (cfg) => browserCheck(cookiemunch, cfg),
  factory: function cookiemunchConsent(w: any) {
    return {
      detect(): boolean {
        if (w.CookieMunch) return true;
        const d = w.document;
        return !!(d && typeof d.getElementById === 'function' && d.getElementById('CookieMunch'));
      },
      state(cfg) {
        const cm = w.CookieMunch;
        if (!cm || !cm.hasResponse) return 'unknown';
        const consent = cm.consent || {};
        let v = consent[cfg.category || 'referrals'];
        if (typeof v !== 'boolean' && !cfg.category) v = consent.marketing;
        return v === true ? 'granted' : 'denied';
      },
      subscribe(_cfg, cb) {
        w.addEventListener('CookieMunchOnChange', cb);
        w.addEventListener('CookieMunchOnLoad', cb);
        return function () {
          w.removeEventListener('CookieMunchOnChange', cb);
          w.removeEventListener('CookieMunchOnLoad', cb);
        };
      },
      evidence() {
        const cm = w.CookieMunch;
        let stamp: unknown = null;
        if (cm && typeof cm.consentId === 'function') stamp = cm.consentId();
        else if (cm && cm.consent && cm.consent.stamp) stamp = cm.consent.stamp;
        return stamp ? { stamp: String(stamp) } : {};
      },
    };
  },
};
