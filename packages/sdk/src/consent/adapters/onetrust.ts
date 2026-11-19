import { browserCheck, type ConsentSource } from '../port.js';

/**
 * OneTrust: `window.OnetrustActiveGroups` (",C0001,C0004,"),
 * `OneTrust.OnConsentChanged` and the `OneTrustGroupsUpdated` window event.
 * Group `C0004` (targeting) by default. An inactive group counts as denied
 * only once the banner was closed (`OneTrust.IsAlertBoxClosed()`).
 */
export const onetrust: ConsentSource = {
  id: 'onetrust',
  name: 'OneTrust',
  defaultCategory: 'C0004',
  status: 'ga',
  docsUrl: 'https://referalli.com/docs/tracking-consent#onetrust',
  vendorDocsUrl: 'https://developer.onetrust.com/',
  check: (cfg) => browserCheck(onetrust, cfg),
  factory: function onetrustConsent(w: any) {
    function groups(): string | null {
      return typeof w.OnetrustActiveGroups === 'string' ? w.OnetrustActiveGroups : null;
    }
    return {
      detect(): boolean {
        return !!(w.OneTrust || w.OneTrustStub || groups() !== null);
      },
      state(cfg) {
        const g = groups();
        if (g === null) return 'unknown';
        if ((',' + g + ',').indexOf(',' + (cfg.category || 'C0004') + ',') >= 0) return 'granted';
        const ot = w.OneTrust;
        const closed =
          ot && typeof ot.IsAlertBoxClosed === 'function'
            ? ot.IsAlertBoxClosed() === true
            : /(?:^|;\s*)OptanonAlertBoxClosed=/.test((w.document && w.document.cookie) || '');
        return closed ? 'denied' : 'unknown';
      },
      subscribe(_cfg, cb) {
        let off = false;
        const fire = function () {
          if (!off) cb();
        };
        w.addEventListener('OneTrustGroupsUpdated', fire);
        try {
          if (w.OneTrust && typeof w.OneTrust.OnConsentChanged === 'function') w.OneTrust.OnConsentChanged(fire);
        } catch {
          /* the event covers it */
        }
        return function () {
          off = true;
          w.removeEventListener('OneTrustGroupsUpdated', fire);
        };
      },
      evidence() {
        const g = groups();
        const out: { purposes: string[]; stamp?: string } = { purposes: g ? g.split(',').filter(Boolean) : [] };
        const ot = w.OneTrust;
        if (ot && typeof ot.getDataSubjectId === 'function') {
          const id = ot.getDataSubjectId();
          if (id) out.stamp = String(id);
        }
        return out;
      },
    };
  },
};
