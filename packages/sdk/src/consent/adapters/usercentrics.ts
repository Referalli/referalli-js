import { browserCheck, type ConsentSource } from '../port.js';

/**
 * Usercentrics: v2 `UC_UI.getServicesBaseInfo()` (services with
 * `consent.status` and `categorySlug`) and v3 `__ucCmp.getConsentDetails()`
 * (async; cached and refreshed on each event). `category` matches a service
 * name (add a "Referalli" service and set it) or a category slug; default
 * `marketing`. Events: `UC_UI_CMP_EVENT`, `UC_UI_INITIALIZED`, `UC_CONSENT`.
 */
export const usercentrics: ConsentSource = {
  id: 'usercentrics',
  name: 'Usercentrics',
  defaultCategory: 'marketing',
  status: 'beta',
  docsUrl: 'https://referalli.com/docs/tracking-consent#usercentrics',
  vendorDocsUrl: 'https://docs.usercentrics.com/',
  check: (cfg) => browserCheck(usercentrics, cfg),
  factory: function usercentricsConsent(w: any) {
    const EVENTS = ['UC_UI_CMP_EVENT', 'UC_UI_INITIALIZED', 'UC_CONSENT', 'UC_UI_VIEW_CHANGED'];
    let v3: any = null;
    function refresh(done: () => void): void {
      const api = w.__ucCmp;
      if (!api || typeof api.getConsentDetails !== 'function') {
        done();
        return;
      }
      try {
        Promise.resolve(api.getConsentDetails()).then(
          function (d: any) {
            v3 = d || null;
            done();
          },
          function () {
            done();
          },
        );
      } catch {
        done();
      }
    }
    return {
      detect(): boolean {
        if (w.UC_UI || w.__ucCmp) return true;
        const d = w.document;
        return !!(d && typeof d.getElementById === 'function' && d.getElementById('usercentrics-cmp'));
      },
      state(cfg) {
        const cat = cfg.category || 'marketing';
        const ui = w.UC_UI;
        if (ui && typeof ui.getServicesBaseInfo === 'function') {
          if (typeof ui.isInitialized === 'function' && !ui.isInitialized()) return 'unknown';
          const list: any[] = ui.getServicesBaseInfo() || [];
          const hit = list.filter(function (s) {
            return s && (s.name === cat || s.categorySlug === cat);
          });
          if (!hit.length) return 'unknown';
          if (
            hit.every(function (s) {
              return s.consent && s.consent.status === true;
            })
          )
            return 'granted';
          if (typeof ui.isConsentRequired === 'function' && ui.isConsentRequired()) return 'unknown';
          return 'denied';
        }
        if (!v3) return 'unknown';
        const services = v3.services || {};
        for (const k in services) {
          const s = services[k];
          if (s && s.name === cat) return s.consent && s.consent.given === true ? 'granted' : v3.consent && v3.consent.required ? 'unknown' : 'denied';
        }
        const c = v3.categories && v3.categories[cat];
        if (c && c.state === 'ALL_ACCEPTED') return 'granted';
        if (v3.consent && v3.consent.required) return 'unknown';
        return c ? 'denied' : 'unknown';
      },
      subscribe(_cfg, cb) {
        let off = false;
        const fire = function () {
          refresh(function () {
            if (!off) cb();
          });
        };
        for (let i = 0; i < EVENTS.length; i++) w.addEventListener(EVENTS[i], fire);
        fire();
        return function () {
          off = true;
          for (let i = 0; i < EVENTS.length; i++) w.removeEventListener(EVENTS[i], fire);
        };
      },
      evidence() {
        const id = v3 && v3.consent && v3.consent.controllerId;
        return id ? { stamp: String(id) } : {};
      },
    };
  },
};
