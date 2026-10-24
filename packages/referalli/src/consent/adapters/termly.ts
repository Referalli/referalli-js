import { browserCheck, type ConsentSource } from '../port.js';

/**
 * Termly: `Termly.getConsentState()` (`{ advertising: true, … }`) and
 * `Termly.on('consent' | 'initialized', cb)`. Category `advertising` by
 * default. A category that isn't true counts as denied only after a consent
 * event on this page, so a returning visitor who declined stays memory-only
 * (never stored) rather than being read as granted. Shape per Termly's
 * consent API docs; not yet checked against a live Termly site.
 */
export const termly: ConsentSource = {
  id: 'termly',
  name: 'Termly',
  defaultCategory: 'advertising',
  status: 'beta',
  docsUrl: 'https://referalli.com/docs/tracking-consent#termly',
  vendorDocsUrl: 'https://termly.io/',
  check: (cfg) => browserCheck(termly, cfg),
  factory: function termlyConsent(w: any) {
    let decided = false;
    return {
      detect(): boolean {
        return !!w.Termly;
      },
      state(cfg) {
        const t = w.Termly;
        if (!t || typeof t.getConsentState !== 'function') return 'unknown';
        const s = t.getConsentState();
        if (!s || typeof s !== 'object') return 'unknown';
        if (s[cfg.category || 'advertising'] === true) return 'granted';
        return decided ? 'denied' : 'unknown';
      },
      subscribe(_cfg, cb) {
        let off = false;
        const t = w.Termly;
        if (t && typeof t.on === 'function') {
          t.on('consent', function () {
            decided = true;
            if (!off) cb();
          });
          t.on('initialized', function () {
            if (!off) cb();
          });
        }
        return function () {
          off = true;
        };
      },
      evidence(cfg) {
        return { purposes: [cfg.category || 'advertising'] };
      },
    };
  },
};
