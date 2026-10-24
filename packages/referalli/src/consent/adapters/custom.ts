import { browserCheck, type ConsentSource } from '../port.js';

/**
 * The contract for any CMP we don't cover: define `window.referalliConsent()`
 * returning `true` (granted), `false` (denied) or `null` (no decision yet),
 * and dispatch a `referalli:consent` window event when it changes. The push
 * path (`aff.consent(true|false)`) needs no adapter at all.
 */
export const custom: ConsentSource = {
  id: 'custom',
  name: 'Custom (window.referalliConsent)',
  defaultCategory: null,
  status: 'ga',
  docsUrl: 'https://referalli.com/docs/tracking-consent#custom',
  vendorDocsUrl: 'https://referalli.com/docs/tracking-consent#custom',
  check: (cfg) => browserCheck(custom, cfg),
  factory: function customConsent(w: any) {
    return {
      detect(): boolean {
        return typeof w.referalliConsent === 'function';
      },
      state() {
        const v = w.referalliConsent();
        return v === true ? 'granted' : v === false ? 'denied' : 'unknown';
      },
      subscribe(_cfg, cb) {
        w.addEventListener('referalli:consent', cb);
        return function () {
          w.removeEventListener('referalli:consent', cb);
        };
      },
      evidence() {
        return {};
      },
    };
  },
};
