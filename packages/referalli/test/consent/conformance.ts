import { gzipSync } from 'node:zlib';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderSnippetJs } from '../../src/served.js';
import type { CmpFixture } from './fakes.js';
import { fakeWindow, load, stored, visits, type Page, type Runtime } from './harness.js';

const LANDING = 'https://shop.example.com/pricing?via=dana';
/** The gzipped size budget of aff.js with one adapter inlined. */
export const ONE_ADAPTER_BUDGET = 6 * 1024;

const tick = async (fx: CmpFixture) => {
  await vi.advanceTimersByTimeAsync(fx.tickMs ?? 0);
};

/**
 * The cases every consent adapter passes, in both runtimes: the served
 * aff.js (run in a VM against a fake window) and `referalli/browser`'s
 * module build. A new adapter adds a fixture (fakes.ts) and gets this suite.
 */
export function runConformance(fx: CmpFixture): void {
  for (const runtime of ['served', 'module'] as Runtime[]) {
    describe(`${fx.id} (${runtime})`, () => {
      beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-10-23T12:00:00Z'));
      });
      afterEach(() => {
        vi.useRealTimers();
      });

      const open = async (mode: string = fx.id, setup?: (p: Omit<Page, 'aff'>) => void) => {
        const page = fakeWindow(LANDING);
        setup?.(page);
        const p = await load(runtime, page, { mode: mode as never, noCmp: 'persist' });
        await vi.advanceTimersByTimeAsync(0);
        return p;
      };

      it('with no decision: no cookie, no localStorage, no beacon, but the referral is readable', async () => {
        const p = await open(fx.id, (pg) => fx.install(pg.w));
        await vi.advanceTimersByTimeAsync(3500);
        expect(stored(p)).toBe(false);
        expect(p.store.size).toBe(0);
        expect(visits(p)).toHaveLength(0);
        expect(p.aff.getReferral().code).toBe('dana');
        expect(p.aff.signupMetadata().referalli_coupon).toBe('dana');
        expect(p.aff.consentState()).toBe('unknown');
      });

      it('after a grant: the twin is written identically and the beacon carries evidence', async () => {
        const p = await open(fx.id, (pg) => fx.install(pg.w));
        fx.grant(p.w);
        await tick(fx);
        expect(p.cookies.get('referalli_ctx')).toBeTruthy();
        expect(p.cookies.get('referally_ctx')).toBe(p.cookies.get('referalli_ctx'));
        expect(p.store.get('referally_ctx')).toBe(p.store.get('referalli_ctx'));
        const [v] = visits(p);
        expect(v).toBeTruthy();
        expect(v!.body.code).toBe('dana');
        expect(v!.body.consent).toMatchObject({ provider: fx.id, state: 'granted', ...(fx.evidence ?? {}) });
        expect(v!.body.consent.at).toMatch(/^2026-10-23T12:00:00\.\d{3}Z$/);
        expect(p.aff.consentMode).toBe(fx.id);
      });

      it('a deny writes nothing', async () => {
        const p = await open(fx.id, (pg) => fx.install(pg.w));
        fx.deny(p.w);
        await tick(fx);
        await vi.advanceTimersByTimeAsync(3500);
        expect(stored(p)).toBe(false);
        expect(visits(p)).toHaveLength(0);
        expect(p.aff.consentState()).toBe('denied');
        expect(p.aff.getReferral().code).toBeNull();
      });

      it('a withdrawal clears storage within one tick', async () => {
        const p = await open(fx.id, (pg) => fx.install(pg.w));
        fx.grant(p.w);
        await tick(fx);
        expect(stored(p)).toBe(true);
        fx.deny(p.w);
        await tick(fx);
        expect(stored(p)).toBe(false);
        expect(p.store.size).toBe(0);
      });

      it('a CMP that loads 2 s after the tracker is picked up by auto', async () => {
        const p = await open('auto');
        await vi.advanceTimersByTimeAsync(2000);
        expect(stored(p)).toBe(false);
        fx.install(p.w);
        await vi.advanceTimersByTimeAsync(150);
        expect(p.aff.consentMode).toBe(fx.id);
        fx.grant(p.w);
        await tick(fx);
        expect(stored(p)).toBe(true);
        expect(visits(p)[0]!.body.consent.provider).toBe(fx.id);
      });

      it('a CMP whose API throws reads unknown', async () => {
        const p = await open(fx.id, (pg) => fx.broken(pg.w));
        await vi.advanceTimersByTimeAsync(3500);
        expect(p.aff.consentState()).toBe('unknown');
        expect(stored(p)).toBe(false);
        expect(visits(p)).toHaveLength(0);
      });

      it('identify waits for the grant', async () => {
        const p = await open(fx.id, (pg) => fx.install(pg.w));
        await p.aff.identify({ customerRef: 'cus_1' });
        expect(p.sent.filter((s) => s.url.endsWith('/identify'))).toHaveLength(0);
        fx.grant(p.w);
        await tick(fx);
        expect(p.sent.filter((s) => s.url.endsWith('/identify'))).toHaveLength(1);
      });
    });
  }

  it(`${fx.id}: aff.js with only this adapter stays within ${ONE_ADAPTER_BUDGET} bytes gzipped`, () => {
    const js = renderSnippetJs('tk_1', 'https://referalli.com', { consent: { mode: fx.id }, consentAdapters: [fx.id] });
    expect(js).toContain(JSON.stringify(fx.id));
    expect(gzipSync(js).length).toBeLessThanOrEqual(ONE_ADAPTER_BUDGET);
  });
}
