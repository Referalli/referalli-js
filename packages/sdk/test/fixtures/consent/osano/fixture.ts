import type { CmpFixture } from '../../../consent/fakes.js';
import { boom } from '../shared.js';

/**
 * osano: the vendor's documented browser API as a fake CMP (no decision, granted,
 * denied, broken). Ids and stamps are obvious fakes.
 */
export const osanoFixture: CmpFixture = {
  id: 'osano',
  install(w) {
    const l: Record<string, Array<() => void>> = {};
    w.__os = { MARKETING: 'DENY', ANALYTICS: 'DENY', ESSENTIAL: 'ACCEPT' };
    w.Osano = {
      cm: {
        getConsent: () => w.__os,
        addEventListener: (n: string, fn: () => void) => (l[n] ??= []).push(fn),
        __fire: (n: string) => (l[n] ?? []).forEach((fn) => fn()),
      },
    };
  },
  grant(w) {
    w.__os = { ...w.__os, MARKETING: 'ACCEPT' };
    w.Osano.cm.__fire('osano-cm-consent-saved');
  },
  deny(w) {
    w.__os = { ...w.__os, MARKETING: 'DENY' };
    w.Osano.cm.__fire('osano-cm-consent-saved');
  },
  broken(w) {
    w.Osano = { cm: { getConsent: boom, addEventListener: boom } };
  },
};
