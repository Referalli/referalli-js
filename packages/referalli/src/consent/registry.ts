import { cookiebot } from './adapters/cookiebot.js';
import { cookiemunch } from './adapters/cookiemunch.js';
import { custom } from './adapters/custom.js';
import { didomi } from './adapters/didomi.js';
import { gcm } from './adapters/gcm.js';
import { gpp } from './adapters/gpp.js';
import { none } from './adapters/none.js';
import { onetrust } from './adapters/onetrust.js';
import { osano } from './adapters/osano.js';
import { tcf } from './adapters/tcf.js';
import { termly } from './adapters/termly.js';
import { usercentrics } from './adapters/usercentrics.js';
import { AUTO_ORDER, type ConsentAdapterFactory, type ConsentAdapterId, type ConsentSource } from './port.js';

/**
 * Every consent adapter, `auto`'s detection order first, then `none`.
 * (`fd-consent`, the suite's `window.__fdConsent`, joins when Cookie Munch
 * ships that contract: CMU-X16.)
 */
export const CONSENT_SOURCES: readonly ConsentSource[] = [
  custom,
  cookiemunch,
  onetrust,
  cookiebot,
  usercentrics,
  didomi,
  osano,
  termly,
  tcf,
  gpp,
  gcm,
  none,
];

/**
 * The consent port's adapters (docs/PORTS.md): every CMP reader, `custom`
 * first. `none` is left out: it reads nothing (it is the "always store" mode,
 * like `auto` and `pending`), so it has no vendor, fixtures or conformance run.
 */
export const ADAPTERS: readonly ConsentSource[] = CONSENT_SOURCES.filter((s) => s.id !== 'none');

const BY_ID = new Map<string, ConsentSource>(CONSENT_SOURCES.map((s) => [s.id, s]));

export function adapterOf(id: string): ConsentSource | undefined {
  return BY_ID.get(id);
}

/** `{ id: factory }` for the gate, limited to `ids` (default: every adapter). */
export function adapterFactories(ids: readonly string[] = AUTO_ORDER): Record<string, ConsentAdapterFactory> {
  const out: Record<string, ConsentAdapterFactory> = {};
  for (const id of ids) {
    const s = BY_ID.get(id);
    if (s) out[id] = s.factory;
  }
  return out;
}

export function isConsentAdapterId(id: unknown): id is ConsentAdapterId {
  return typeof id === 'string' && BY_ID.has(id);
}
