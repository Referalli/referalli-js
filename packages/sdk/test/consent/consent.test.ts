import { gzipSync } from 'node:zlib';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_SOURCES } from '../../src/consent/registry.js';
import { AUTO_ORDER } from '../../src/consent/port.js';
import { renderSnippetJs } from '../../src/served.js';
import { runConformance } from './conformance.js';
import { FIXTURES } from './fakes.js';
import { fakeWindow, load, servedPage, stored, visits, type Runtime } from './harness.js';

describe('consent adapters: conformance', () => {
  for (const fx of FIXTURES) runConformance(fx);
});

describe('consent registry', () => {
  it('every adapter except none has a fixture, docs and a vendor reference', () => {
    const withFixtures = new Set(FIXTURES.map((f) => f.id));
    for (const s of CONSENT_SOURCES) {
      if (s.id !== 'none') expect(withFixtures.has(s.id), `${s.id} has no conformance fixture`).toBe(true);
      expect(s.docsUrl).toMatch(/^https:\/\/referalli\.com\/docs\/tracking-consent#/);
      expect(s.vendorDocsUrl).toMatch(/^https:\/\//);
    }
    expect(CONSENT_SOURCES.map((s) => s.id)).toEqual([...AUTO_ORDER, 'none']);
  });

  it('aff.js with every adapter inlined stays within 14 KB gzipped', () => {
    expect(gzipSync(renderSnippetJs('tk_1', 'https://referalli.com', { consent: { mode: 'auto' } })).length).toBeLessThanOrEqual(14 * 1024);
  });
});

const LANDING = 'https://shop.example.com/?via=dana';

for (const runtime of ['served', 'module'] as Runtime[]) {
  describe(`consent gate (${runtime})`, () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('auto picks the first CMP in the documented order when two are present', async () => {
      const page = fakeWindow(LANDING);
      FIXTURES.find((f) => f.id === 'tcf')!.install(page.w);
      FIXTURES.find((f) => f.id === 'onetrust')!.install(page.w);
      const p = await load(runtime, page, { mode: 'auto' });
      expect(p.aff.consentMode).toBe('onetrust');
    });

    it('none stores and sends at once, with none as the provider', async () => {
      const p = await load(runtime, fakeWindow(LANDING), { mode: 'none' });
      expect(stored(p)).toBe(true);
      expect(visits(p)[0]!.body.consent).toMatchObject({ provider: 'none', state: 'granted' });
    });

    it('auto without a CMP applies noCmp persist after the wait', async () => {
      const p = await load(runtime, fakeWindow(LANDING), { mode: 'auto', noCmp: 'persist' });
      await vi.advanceTimersByTimeAsync(2900);
      expect(stored(p)).toBe(false);
      await vi.advanceTimersByTimeAsync(200);
      expect(stored(p)).toBe(true);
      expect(visits(p)[0]!.body.consent.provider).toBe('no-cmp');
      expect(p.aff.consentMode).toBe('no-cmp');
    });

    it('auto without a CMP and noCmp memory never stores', async () => {
      const p = await load(runtime, fakeWindow(LANDING), { mode: 'auto', noCmp: 'memory' });
      await vi.advanceTimersByTimeAsync(5000);
      expect(stored(p)).toBe(false);
      expect(p.aff.getReferral().code).toBe('dana');
    });

    it('leaving the page before the wait ends applies the no-CMP rule at once', async () => {
      const page = fakeWindow(LANDING);
      const p = await load(runtime, page, { mode: 'auto', noCmp: 'persist' });
      expect(stored(p)).toBe(false);
      page.w.document.visibilityState = 'hidden';
      page.w.dispatch('pagehide');
      expect(stored(p)).toBe(true);
      expect(visits(p)).toHaveLength(1);
    });

    it('pending waits for the push path; aff.consent is idempotent and the latest signal wins', async () => {
      const p = await load(runtime, fakeWindow(LANDING), { mode: 'pending' });
      await vi.advanceTimersByTimeAsync(5000);
      expect(stored(p)).toBe(false);
      p.aff.consent(true);
      p.aff.consent(true);
      expect(stored(p)).toBe(true);
      expect(visits(p)).toHaveLength(1);
      expect(visits(p)[0]!.body.consent.provider).toBe('custom');
      p.aff.consent(false);
      expect(stored(p)).toBe(false);
      expect(p.aff.consentState()).toBe('denied');
    });

    it('a denial drops the referral; a later grant on the same page stores it again', async () => {
      const p = await load(runtime, fakeWindow(LANDING), { mode: 'pending' });
      p.aff.consent(false);
      expect(p.aff.getReferral().code).toBeNull();
      p.aff.consent(true);
      expect(p.aff.getReferral().code).toBe('dana');
      expect(stored(p)).toBe(true);
    });
  });
}

describe('served aff.js: tag options and the queue stub', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('data-consent on the tag overrides the org default', () => {
    const page = fakeWindow(LANDING);
    const p = servedPage(page, { 'data-consent': 'pending' }, { consent: { mode: 'none' } });
    expect(stored(p)).toBe(false);
    expect(p.aff.consentMode).toBe('pending');
  });

  it('an unknown data-consent value keeps the org default', () => {
    const p = servedPage(fakeWindow(LANDING), { 'data-consent': 'bogus' }, { consent: { mode: 'none' } });
    expect(stored(p)).toBe(true);
  });

  it('data-consent-category reaches the adapter', async () => {
    const page = fakeWindow(LANDING);
    page.w.OnetrustActiveGroups = ',C0001,C0007,';
    page.w.OneTrust = { IsAlertBoxClosed: () => true };
    const p = servedPage(page, { 'data-consent': 'onetrust', 'data-consent-category': 'C0007' });
    expect(stored(p)).toBe(true);
  });

  it('drains calls queued before load, and keeps aff.q.push working after', () => {
    const page = fakeWindow(LANDING);
    page.w.aff = { q: [['consent', true]] };
    const p = servedPage(page, {}, { consent: { mode: 'pending' } });
    expect(stored(p)).toBe(true);
    p.aff.q.push(['consent', false]);
    expect(stored(p)).toBe(false);
  });

  it('without any consent setting, the tag behaves as before: stored and sent at once', () => {
    const p = servedPage(fakeWindow(LANDING));
    expect(stored(p)).toBe(true);
    expect(visits(p)).toHaveLength(1);
    expect(p.aff.consentMode).toBe('none');
  });

  it('?consent=<id> inlines only that adapter', () => {
    const js = renderSnippetJs('tk_1', 'https://referalli.com', { consent: { mode: 'onetrust' }, consentAdapters: ['onetrust'] });
    expect(js).toContain('onetrustConsent');
    expect(js).not.toContain('cookiebotConsent');
  });
});

describe('gpp: US opt-out sections', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it('a sale opt-out denies; no opt-out grants', async () => {
    for (const [optOut, want] of [
      [1, false],
      [2, true],
    ] as const) {
      const page = fakeWindow(LANDING);
      const ping = { signalStatus: 'ready', applicableSections: [7], parsedSections: { usnat: { SaleOptOut: optOut, SharingOptOut: 2 } }, gppString: 'DBA' };
      page.w.__gpp = (cmd: string, cb: (p: unknown, ok: boolean) => void) => (cmd === 'ping' ? cb(ping, true) : cb({ pingData: ping }, true));
      const p = await load('module', page, { mode: 'gpp' });
      expect(stored(p)).toBe(want);
    }
  });
});
