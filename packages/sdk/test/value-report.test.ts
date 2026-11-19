import { describe, expect, it } from 'vitest';
import { ReferalliClient } from '../src/index.js';

describe('value reporting helpers', () => {
  it('each helper posts one event of its kind to /v1/value/events', async () => {
    const calls: Array<{ url: string; method: string | undefined; body: { events: Array<Record<string, unknown>> } }> = [];
    const fetchFn = async (url: string, init: RequestInit) => {
      calls.push({ url, method: init.method, body: JSON.parse(String(init.body)) });
      return new Response(JSON.stringify({ results: [], errors: [] }));
    };
    const c = new ReferalliClient({ apiKey: 'rk_x', baseUrl: 'https://api.example.com', fetchFn });
    const when = '2026-09-01T00:00:00Z';
    await c.reportPayment({ customerRef: 'c', currency: 'usd', cashMinor: 900, creditAppliedMinor: 100, externalId: 'p1', occurredAt: when });
    await c.reportCreditGranted({ customerRef: 'c', role: 'referee', faceMinor: 500, currency: 'usd', externalId: 'g1', occurredAt: when });
    await c.reportCreditUsed({ customerRef: 'c', creditAppliedMinor: 100, currency: 'usd', externalId: 'u1', occurredAt: when });
    await c.reportCost({ partnerExternalRef: 'p', costMinor: 40, currency: 'usd', externalId: 'k1', occurredAt: new Date(when) });
    expect(calls.map((x) => x.body.events[0]!.kind)).toEqual(['payment', 'credit_granted', 'credit_redeemed', 'cost']);
    expect(calls.every((x) => x.url === 'https://api.example.com/v1/value/events' && x.method === 'POST')).toBe(true);
    expect(calls[3]!.body.events[0]!.occurredAt).toBe('2026-09-01T00:00:00.000Z');
  });
});
