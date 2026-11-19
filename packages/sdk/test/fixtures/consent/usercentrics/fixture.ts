import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * usercentrics: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
export const usercentricsFixture: CmpFixture = {
  id: 'usercentrics',
  install(w) {
    w.__uc = { status: false, required: true };
    w.UC_UI = {
      isInitialized: () => true,
      isConsentRequired: () => w.__uc.required,
      getServicesBaseInfo: () => [
        { name: 'Google Analytics', categorySlug: 'marketing', consent: { status: true } },
        { name: 'Referalli', categorySlug: 'marketing', consent: { status: w.__uc.status } },
      ],
    };
  },
  grant(w) {
    w.__uc = { status: true, required: false };
    w.dispatch('UC_UI_CMP_EVENT');
  },
  deny(w) {
    w.__uc = { status: false, required: false };
    w.dispatch('UC_UI_CMP_EVENT');
  },
  broken(w) {
    w.UC_UI = { isInitialized: () => true, getServicesBaseInfo: boom };
  },
};
