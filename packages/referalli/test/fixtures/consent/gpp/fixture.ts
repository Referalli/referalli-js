import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * gpp: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
const gppPing = (ready: boolean, purposeConsent: boolean[]) => ({
  gppVersion: '1.1',
  signalStatus: ready ? 'ready' : 'not ready',
  applicableSections: [2],
  parsedSections: ready ? { tcfeuv2: [{ PurposeConsent: purposeConsent }] } : {},
  gppString: 'DBABMA~CPgpp',
});
export const gppFixture: CmpFixture = {
  id: 'gpp',
  install(w) {
    const listeners: Array<(e: unknown, ok: boolean) => void> = [];
    w.__g = { ping: gppPing(false, []), listeners };
    w.__gpp = (cmd: string, cb: (e: unknown, ok: boolean) => void) => {
      if (cmd === 'addEventListener') {
        listeners.push(cb);
        cb({ eventName: 'listenerRegistered', pingData: w.__g.ping }, true);
      } else if (cmd === 'ping') cb(w.__g.ping, true);
    };
  },
  grant(w) {
    w.__g.ping = gppPing(true, [true, false, false, false, false, false, true]);
    for (const cb of w.__g.listeners) cb({ eventName: 'signalStatus', pingData: w.__g.ping }, true);
  },
  deny(w) {
    w.__g.ping = gppPing(true, [false]);
    for (const cb of w.__g.listeners) cb({ eventName: 'signalStatus', pingData: w.__g.ping }, true);
  },
  broken(w) {
    w.__gpp = boom;
  },
  evidence: { gppString: 'DBABMA~CPgpp' },
};
