import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * tcf: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
const tcfData = (status: string, consents: Record<number, boolean>) => ({
  tcString: 'CO-tcf-string',
  gdprApplies: true,
  eventStatus: status,
  purpose: { consents },
  publisher: { consents: {} },
  vendor: { consents: {} },
});
export const tcfFixture: CmpFixture = {
  id: 'tcf',
  install(w) {
    const listeners: Array<(d: unknown, ok: boolean) => void> = [];
    w.__tcf = { data: tcfData('cmpuishown', {}), listeners };
    w.__tcfapi = (cmd: string, _v: number, cb: (d: unknown, ok: boolean) => void) => {
      if (cmd === 'addEventListener') {
        listeners.push(cb);
        cb(w.__tcf.data, true);
      }
    };
  },
  grant(w) {
    w.__tcf.data = tcfData('useractioncomplete', { 1: true, 7: true });
    for (const cb of w.__tcf.listeners) cb(w.__tcf.data, true);
  },
  deny(w) {
    w.__tcf.data = tcfData('useractioncomplete', { 1: false });
    for (const cb of w.__tcf.listeners) cb(w.__tcf.data, true);
  },
  broken(w) {
    w.__tcfapi = boom;
  },
  evidence: { tcString: 'CO-tcf-string' },
};
