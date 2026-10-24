import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * custom: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
export const customFixture: CmpFixture = {
  id: 'custom',
  install(w) {
    w.__decision = null;
    w.referalliConsent = () => w.__decision;
  },
  grant(w) {
    w.__decision = true;
    w.dispatch('referalli:consent');
  },
  deny(w) {
    w.__decision = false;
    w.dispatch('referalli:consent');
  },
  broken(w) {
    w.referalliConsent = boom;
  },
};
