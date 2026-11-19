import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * gcm: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
export const gcmFixture: CmpFixture = {
  id: 'gcm',
  install(w) {
    w.dataLayer = [['consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied' }]];
  },
  grant(w) {
    w.dataLayer.push(['consent', 'update', { ad_storage: 'granted' }]);
  },
  deny(w) {
    w.dataLayer.push(['consent', 'update', { ad_storage: 'denied' }]);
  },
  broken(w) {
    w.dataLayer = [
      {
        get 0() {
          return boom();
        },
      },
    ];
  },
  tickMs: 300,
};
