import { browserCheck, type ConsentSource } from '../port.js';

/**
 * IAB GPP: `__gpp('addEventListener', cb)` and `__gpp('ping', cb)`. Waits for
 * `signalStatus: 'ready'`. The EU TCF section (id 2) follows the `tcf`
 * rules (purpose 1 plus 7 or 9); US state sections are opt-out, so any
 * `SaleOptOut`, `SharingOptOut` or `TargetedAdvertisingOptOut` of 1 (opted
 * out) denies and anything else grants. Evidence: `gppString`.
 */
export const gpp: ConsentSource = {
  id: 'gpp',
  name: 'IAB GPP',
  defaultCategory: null,
  status: 'beta',
  docsUrl: 'https://referalli.com/docs/tracking-consent#gpp',
  vendorDocsUrl: 'https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform',
  check: (cfg) => browserCheck(gpp, cfg),
  factory: function gppConsent(w: any) {
    let ping: any = null;
    let listening = false;
    const subs: Array<() => void> = [];
    function set(p: any): void {
      if (!p || typeof p !== 'object') return;
      ping = p;
      const list = subs.slice();
      for (let i = 0; i < list.length; i++) (list[i] as () => void)();
    }
    function listen(): void {
      if (listening || typeof w.__gpp !== 'function') return;
      listening = true;
      w.__gpp('addEventListener', function (ev: any, ok: boolean) {
        if (ok !== false && ev) set(ev.pingData || null);
      });
      w.__gpp('ping', function (p: any, ok: boolean) {
        if (ok !== false) set(p);
      });
    }
    function seg(s: any): any {
      return Array.isArray(s) ? s[0] : s;
    }
    return {
      detect(): boolean {
        return typeof w.__gpp === 'function';
      },
      state() {
        listen();
        if (!ping || ping.signalStatus !== 'ready') return 'unknown';
        const secs = ping.parsedSections || {};
        const applicable: number[] = ping.applicableSections || [];
        const eu = seg(secs.tcfeuv2);
        if (applicable.indexOf(2) >= 0 && eu) {
          const pc = eu.PurposeConsent || [];
          const p = function (n: number) {
            return !!(pc[n - 1] === true || pc[n - 1] === 1);
          };
          return p(1) && (p(7) || p(9)) ? 'granted' : 'denied';
        }
        for (const k in secs) {
          if (k === 'tcfeuv2' || k === 'tcfcav1') continue;
          const s = seg(secs[k]);
          if (s && typeof s === 'object' && (s.SaleOptOut === 1 || s.SharingOptOut === 1 || s.TargetedAdvertisingOptOut === 1)) {
            return 'denied';
          }
        }
        return 'granted';
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
        if (!ping) return null;
        return { gppString: typeof ping.gppString === 'string' ? ping.gppString : undefined };
      },
    };
  },
};
