import { browserCheck, type ConsentSource } from '../port.js';

/**
 * Cookiebot: `Cookiebot.consent.<category>`, `Cookiebot.hasResponse` and the
 * `CookiebotOnConsentReady` / `OnAccept` / `OnDecline` window events.
 * Category `marketing` by default; `consentID` is the evidence stamp.
 */
export const cookiebot: ConsentSource = {
  id: 'cookiebot',
  name: 'Cookiebot',
  defaultCategory: 'marketing',
  status: 'ga',
  docsUrl: 'https://referalli.com/docs/tracking-consent#cookiebot',
  vendorDocsUrl: 'https://www.cookiebot.com/en/developer/',
  check: (cfg) => browserCheck(cookiebot, cfg),
  factory: function cookiebotConsent(w: any) {
    const EVENTS = ['CookiebotOnConsentReady', 'CookiebotOnAccept', 'CookiebotOnDecline', 'CookiebotOnLoad'];
    return {
      detect(): boolean {
        if (w.Cookiebot) return true;
        const d = w.document;
        return !!(d && typeof d.getElementById === 'function' && d.getElementById('Cookiebot'));
      },
      state(cfg) {
        const cb = w.Cookiebot;
        if (!cb || !cb.consent) return 'unknown';
        if (cb.consent[cfg.category || 'marketing'] === true) return 'granted';
        return cb.hasResponse ? 'denied' : 'unknown';
      },
      subscribe(_cfg, cb) {
        for (let i = 0; i < EVENTS.length; i++) w.addEventListener(EVENTS[i], cb);
        return function () {
          for (let i = 0; i < EVENTS.length; i++) w.removeEventListener(EVENTS[i], cb);
        };
      },
      evidence() {
        const c = w.Cookiebot;
        return c && c.consentID ? { stamp: String(c.consentID) } : {};
      },
    };
  },
};
