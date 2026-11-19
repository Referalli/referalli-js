import { browserCheck, type ConsentSource } from '../port.js';

/**
 * Osano: `Osano.cm.getConsent()` (`MARKETING: 'ACCEPT' | 'DENY'`, …) and the
 * `osano-cm-consent-saved` / `osano-cm-consent-changed` events. Category
 * `MARKETING` by default. `DENY` counts as denied only once a choice was saved
 * (the event, or Osano's `osano_consentmanager` record); before that it is
 * Osano's opt-in default, so no decision.
 */
export const osano: ConsentSource = {
  id: 'osano',
  name: 'Osano',
  defaultCategory: 'MARKETING',
  status: 'beta',
  docsUrl: 'https://referalli.com/docs/tracking-consent#osano',
  vendorDocsUrl: 'https://developers.osano.com/',
  check: (cfg) => browserCheck(osano, cfg),
  factory: function osanoConsent(w: any) {
    let saved = false;
    function stored(): boolean {
      try {
        if (w.localStorage && w.localStorage.getItem('osano_consentmanager')) return true;
      } catch {
        /* storage blocked */
      }
      return /(?:^|;\s*)osano_consentmanager=/.test((w.document && w.document.cookie) || '');
    }
    return {
      detect(): boolean {
        return !!(w.Osano && w.Osano.cm);
      },
      state(cfg) {
        const cm = w.Osano && w.Osano.cm;
        if (!cm || typeof cm.getConsent !== 'function') return 'unknown';
        const c = cm.getConsent() || {};
        if (c[cfg.category || 'MARKETING'] === 'ACCEPT') return 'granted';
        return saved || stored() ? 'denied' : 'unknown';
      },
      subscribe(_cfg, cb) {
        let off = false;
        const cm = w.Osano && w.Osano.cm;
        const onSave = function () {
          saved = true;
          if (!off) cb();
        };
        const onChange = function () {
          if (!off) cb();
        };
        if (cm && typeof cm.addEventListener === 'function') {
          cm.addEventListener('osano-cm-consent-saved', onSave);
          cm.addEventListener('osano-cm-consent-changed', onSave);
          cm.addEventListener('osano-cm-initialized', onChange);
        }
        return function () {
          off = true;
        };
      },
      evidence(cfg) {
        return { purposes: [cfg.category || 'MARKETING'] };
      },
    };
  },
};
