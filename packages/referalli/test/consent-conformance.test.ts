import { describe, expect, it } from 'vitest';
import { runConformance } from '../src/consent/conformance.js';
import { ADAPTERS } from '../src/consent/registry.js';
import { FIXTURES } from './consent/fakes.js';
import { fakeWindow } from './consent/harness.js';

// docs/PORTS.md: the consent port's runtime-free conformance cases, over every adapter
// with its fixture (test/fixtures/consent/<id>/). The served/module cases are in consent/consent.test.ts.
for (const source of ADAPTERS) {
  const fx = FIXTURES.find((f) => f.id === source.id);
  describe(`consent fixture ${source.id}`, () => {
    it('exists', () => expect(fx).toBeDefined());
  });
  if (fx) runConformance(source, fx, () => fakeWindow('https://shop.example.com/').w, { describe, it, expect });
}
