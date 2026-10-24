import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * didomi: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
export const didomiFixture: CmpFixture = {
  id: 'didomi',
  install(w) {
    w.__dd = { enabled: [] as string[], decided: false };
    w.Didomi = {
      isConsentRequired: () => true,
      shouldConsentBeCollected: () => !w.__dd.decided,
      getUserStatus: () => ({
        purposes: { global: { enabled: w.__dd.enabled, disabled: [] } },
        vendors: { global: { enabled: [], disabled: [] } },
        user_id: 'dd-user-1',
        consent_string: 'CPdidomiTC',
      }),
    };
  },
  grant(w) {
    w.__dd = { enabled: ['cookies', 'select_basic_ads'], decided: true };
    for (const l of w.didomiEventListeners ?? []) if (l.event === 'consent.changed') l.listener({});
  },
  deny(w) {
    w.__dd = { enabled: [], decided: true };
    for (const l of w.didomiEventListeners ?? []) if (l.event === 'consent.changed') l.listener({});
  },
  broken(w) {
    w.Didomi = { getUserStatus: boom };
  },
  evidence: { stamp: 'dd-user-1', tcString: 'CPdidomiTC' },
};
