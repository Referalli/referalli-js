import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * termly: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
export const termlyFixture: CmpFixture = {
  id: 'termly',
  install(w) {
    const l: Record<string, Array<() => void>> = {};
    w.__tm = { essential: true, advertising: false };
    w.Termly = {
      getConsentState: () => w.__tm,
      on: (n: string, fn: () => void) => (l[n] ??= []).push(fn),
      __fire: (n: string) => (l[n] ?? []).forEach((fn) => fn()),
    };
  },
  grant(w) {
    w.__tm = { essential: true, advertising: true };
    w.Termly.__fire('consent');
  },
  deny(w) {
    w.__tm = { essential: true, advertising: false };
    w.Termly.__fire('consent');
  },
  broken(w) {
    w.Termly = { getConsentState: boom, on: boom };
  },
};
