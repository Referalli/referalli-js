import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * onetrust: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
export const onetrustFixture: CmpFixture = {
  id: 'onetrust',
  install(w) {
    const cbs: Array<() => void> = [];
    w.__closed = false;
    w.OnetrustActiveGroups = ',C0001,';
    w.OneTrust = {
      IsAlertBoxClosed: () => w.__closed,
      OnConsentChanged: (fn: () => void) => cbs.push(fn),
      getDataSubjectId: () => 'ot-subject-1',
      __cbs: cbs,
    };
  },
  grant(w) {
    w.__closed = true;
    w.OnetrustActiveGroups = ',C0001,C0002,C0004,';
    for (const fn of w.OneTrust.__cbs) fn();
    w.dispatch('OneTrustGroupsUpdated');
  },
  deny(w) {
    w.__closed = true;
    w.OnetrustActiveGroups = ',C0001,';
    for (const fn of w.OneTrust.__cbs) fn();
    w.dispatch('OneTrustGroupsUpdated');
  },
  broken(w) {
    w.OneTrust = { IsAlertBoxClosed: boom, OnConsentChanged: boom };
    Object.defineProperty(w, 'OnetrustActiveGroups', { get: boom, configurable: true });
  },
  evidence: { stamp: 'ot-subject-1' },
};
