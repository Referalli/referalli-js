import { consentGate } from './gate.js';
import { AUTO_ORDER } from './port.js';
import { adapterOf } from './registry.js';

/**
 * The consent gate and adapters as JavaScript source, for the served aff.js.
 * Built from the same functions the module build runs (their source text), so
 * there is one implementation. `__name` is a no-op stand-in for the helper
 * esbuild (tsx, vitest) inserts into function bodies under keepNames.
 *
 * `ids`: the adapters to inline (default: all of `auto`'s, in order).
 */
export function consentSource(ids: readonly string[] = AUTO_ORDER): { gate: string; adapters: string; order: string } {
  const list = AUTO_ORDER.filter((id) => ids.includes(id));
  const adapters = list.map((id) => `${JSON.stringify(id)}:(${String(adapterOf(id)!.factory)})`).join(',\n');
  return {
    gate: `(${String(consentGate)})`,
    adapters: `{${adapters}}`,
    order: JSON.stringify(list),
  };
}

/** The no-op `__name` shim (see consentSource). */
export const NAME_SHIM = 'var __name=function(t){return t;};';
