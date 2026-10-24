import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * cookiebot: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
export const cookiebotFixture: CmpFixture = {
  id: 'cookiebot',
  install(w) {
    w.Cookiebot = { consent: { necessary: true, marketing: false }, hasResponse: false, consentID: 'cb-1' };
  },
  grant(w) {
    w.Cookiebot.hasResponse = true;
    w.Cookiebot.consent = { necessary: true, marketing: true };
    w.dispatch('CookiebotOnAccept');
  },
  deny(w) {
    w.Cookiebot.hasResponse = true;
    w.Cookiebot.consent = { necessary: true, marketing: false };
    w.dispatch('CookiebotOnDecline');
  },
  broken(w) {
    w.Cookiebot = {
      get consent() {
        return boom();
      },
    };
  },
  evidence: { stamp: 'cb-1' },
};
