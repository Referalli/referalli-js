import type { ConsentSource } from './port.js';

/** The vitest functions, passed in so this module never imports a test runner at runtime. */
export interface TestApi {
  describe: (name: string, fn: () => void) => void;
  it: (name: string, fn: () => unknown) => void;
  expect: (value: unknown) => any;
}

/** A fake CMP built from the vendor's documented browser API (test/fixtures/consent/<id>/). */
export interface ConsentFixture {
  install(w: any): void;
  grant(w: any): void;
  deny(w: any): void;
  broken(w: any): void;
}

/**
 * The runtime-free half of the consent conformance suite (REF-P01,
 * docs/PORTS.md): every adapter declares its docs and status, answers check(),
 * is not detected on a page without its CMP, and never throws out of state()
 * when the CMP's API throws (the gate reads that as `unknown`). The full
 * served-script and module-build cases run in test/consent/conformance.ts.
 */
export function runConformance(source: ConsentSource, fx: ConsentFixture, newWindow: () => any, t: TestApi): void {
  const { describe, it, expect } = t;
  describe(`consent adapter ${source.id} conformance`, () => {
    it('declares its docs, vendor docs and status', () => {
      expect(source.docsUrl).toMatch(/^https:\/\/referalli\.com\/docs\//);
      expect(source.vendorDocsUrl).toMatch(/^https:\/\//);
      expect(['ga', 'beta']).toContain(source.status);
    });
    it('answers check()', async () => {
      const r = await source.check();
      expect(typeof r.ok).toBe('boolean');
      expect(typeof r.detail).toBe('string');
    });
    it('is not detected on a page without its CMP', () => {
      expect(source.factory(newWindow()).detect()).toBe(false);
    });
    it('is detected once its CMP is on the page', () => {
      const w = newWindow();
      fx.install(w);
      expect(source.factory(w).detect()).toBe(true);
    });
  });
}
