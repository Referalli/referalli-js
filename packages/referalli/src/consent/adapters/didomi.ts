import { browserCheck, type ConsentSource } from '../port.js';

/**
 * Didomi: `Didomi.getUserStatus()` (purposes and vendors, each with
 * `global.enabled`), `didomiOnReady` and the `consent.changed` event via
 * `didomiEventListeners`. `category` is a purpose id (default `cookies`), or a
 * vendor id when it contains a colon (`c:referalli-…`) or is numeric (IAB).
 * Not enabled counts as denied only once `shouldConsentBeCollected()` is false.
 */
export const didomi: ConsentSource = {
  id: 'didomi',
  name: 'Didomi',
  defaultCategory: 'cookies',
  status: 'beta',
  docsUrl: 'https://referalli.com/docs/tracking-consent#didomi',
  vendorDocsUrl: 'https://developers.didomi.io/',
  check: (cfg) => browserCheck(didomi, cfg),
  factory: function didomiConsent(w: any) {
    return {
      detect(): boolean {
        return !!(w.Didomi || w.didomiOnReady || w.didomiConfig);
      },
      state(cfg) {
        const d = w.Didomi;
        if (!d || typeof d.getUserStatus !== 'function') return 'unknown';
        if (typeof d.isConsentRequired === 'function' && d.isConsentRequired() === false) return 'granted';
        const cat = String(cfg.category || 'cookies');
        const vendor = cat.indexOf(':') >= 0 || /^\d+$/.test(cat);
        const st = d.getUserStatus() || {};
        const set = vendor ? st.vendors : st.purposes;
        const enabled: unknown[] = (set && set.global && set.global.enabled) || [];
        for (let i = 0; i < enabled.length; i++) if (String(enabled[i]) === cat) return 'granted';
        if (typeof d.shouldConsentBeCollected === 'function' && d.shouldConsentBeCollected()) return 'unknown';
        return 'denied';
      },
      subscribe(_cfg, cb) {
        let off = false;
        const fire = function () {
          if (!off) cb();
        };
        w.didomiEventListeners = w.didomiEventListeners || [];
        w.didomiEventListeners.push({ event: 'consent.changed', listener: fire });
        w.didomiOnReady = w.didomiOnReady || [];
        w.didomiOnReady.push(fire);
        return function () {
          off = true;
        };
      },
      evidence() {
        const d = w.Didomi;
        const st = d && typeof d.getUserStatus === 'function' ? d.getUserStatus() || {} : {};
        return {
          ...(st.user_id ? { stamp: String(st.user_id) } : {}),
          ...(typeof st.consent_string === 'string' && st.consent_string ? { tcString: st.consent_string } : {}),
        };
      },
    };
  },
};
