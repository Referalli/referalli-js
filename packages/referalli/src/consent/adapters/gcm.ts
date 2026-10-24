import { browserCheck, type ConsentSource } from '../port.js';

/**
 * Google Consent Mode v2: `gtag('consent', 'default' | 'update', {...})`
 * commands in `window.dataLayer`, following `ad_storage` (or
 * `analytics_storage` via `gcmSignal`). An `update` decides. A default of
 * `granted` everywhere grants; a `denied` default (often region-scoped) with
 * no update yet is no decision. gtag.js replaces `dataLayer.push`, so changes
 * are picked up by watching the queue (every 250 ms).
 */
export const gcm: ConsentSource = {
  id: 'gcm',
  name: 'Google Consent Mode v2',
  defaultCategory: 'ad_storage',
  status: 'ga',
  docsUrl: 'https://referalli.com/docs/tracking-consent#google-consent-mode',
  vendorDocsUrl: 'https://developers.google.com/tag-platform/security/guides/consent',
  check: (cfg) => browserCheck(gcm, cfg),
  factory: function gcmConsent(w: any) {
    function cmd(e: any): boolean {
      return !!(e && typeof e === 'object' && e[0] === 'consent' && (e[1] === 'default' || e[1] === 'update') && e[2] && typeof e[2] === 'object');
    }
    function queue(): any[] {
      const dl = w.dataLayer;
      return dl && typeof dl.length === 'number' ? dl : [];
    }
    return {
      detect(): boolean {
        const dl = queue();
        for (let i = 0; i < dl.length; i++) if (cmd(dl[i])) return true;
        return false;
      },
      state(cfg) {
        const sig = cfg.gcmSignal || 'ad_storage';
        const dl = queue();
        let update: string | null = null;
        let anyDenied = false;
        let anyGranted = false;
        for (let i = 0; i < dl.length; i++) {
          const e = dl[i];
          if (!cmd(e) || typeof e[2][sig] !== 'string') continue;
          if (e[1] === 'update') update = e[2][sig];
          else if (e[2][sig] === 'granted') anyGranted = true;
          else anyDenied = true;
        }
        if (update !== null) return update === 'granted' ? 'granted' : 'denied';
        if (anyGranted && !anyDenied) return 'granted';
        return 'unknown';
      },
      subscribe(_cfg, cb) {
        let n = queue().length;
        const t = w.setInterval(function () {
          const l = queue().length;
          if (l !== n) {
            n = l;
            cb();
          }
        }, 250);
        return function () {
          w.clearInterval(t);
        };
      },
      evidence(cfg) {
        return { purposes: [cfg.gcmSignal || 'ad_storage'] };
      },
    };
  },
};
