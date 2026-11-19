import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * cookiemunch: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
export const cookiemunchFixture: CmpFixture = {
  id: 'cookiemunch',
  install(w) {
    w.CookieMunch = { hasResponse: false, consent: { necessary: true }, consentId: () => 'cm-stamp-1' };
  },
  grant(w) {
    w.CookieMunch.hasResponse = true;
    w.CookieMunch.consent = { necessary: true, referrals: true, marketing: false };
    w.dispatch('CookieMunchOnChange');
  },
  deny(w) {
    w.CookieMunch.hasResponse = true;
    w.CookieMunch.consent = { necessary: true, referrals: false, marketing: true };
    w.dispatch('CookieMunchOnChange');
  },
  broken(w) {
    w.CookieMunch = {
      get hasResponse() {
        return boom();
      },
    };
  },
  evidence: { stamp: 'cm-stamp-1' },
};
