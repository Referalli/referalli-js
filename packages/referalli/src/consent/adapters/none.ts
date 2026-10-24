import { browserCheck, type ConsentSource } from '../port.js';

/** No consent check: always granted (the tracker before consent support). Only for sites that need no opt-in. */
export const none: ConsentSource = {
  id: 'none',
  name: 'None (always store)',
  defaultCategory: null,
  status: 'ga',
  docsUrl: 'https://referalli.com/docs/tracking-consent#choose-a-mode',
  vendorDocsUrl: 'https://referalli.com/docs/tracking-consent#choose-a-mode',
  check: (cfg) => browserCheck(none, cfg),
  factory: function noneConsent() {
    return {
      detect(): boolean {
        return true;
      },
      state() {
        return 'granted';
      },
      subscribe() {
        return function () {};
      },
      evidence() {
        return {};
      },
    };
  },
};
