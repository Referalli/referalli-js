// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { forwardStripeEvent } from '../src/server.js';

const event = (type: string) => ({ id: 'evt_1', type, created: 1, data: { object: { id: 'in_1' } } });
const opts = (reply: () => Response | Error) => {
  const seen: { url: string; headers: Record<string, string>; body: string }[] = [];
  return {
    seen,
    opts: {
      connectionId: 'bc_1',
      secret: 's',
      baseUrl: 'https://api.test',
      fetch: async (url: string, init: RequestInit) => {
        seen.push({ url, headers: init.headers as Record<string, string>, body: init.body as string });
        const r = reply();
        if (r instanceof Error) throw r;
        return r;
      },
    },
  };
};
const err = (status: number) => new Response(JSON.stringify({ error: { code: 'x', message: 'no' } }), { status, headers: { 'content-type': 'application/json' } });

describe('forwardStripeEvent', () => {
  it('signs and posts a used event type', async () => {
    const t = opts(() => new Response('{"received":1}', { status: 200, headers: { 'content-type': 'application/json' } }));
    expect(await forwardStripeEvent(event('invoice.paid'), t.opts)).toEqual({ status: 'sent' });
    expect(t.seen[0]!.url).toBe('https://api.test/v1/billing/connections/bc_1/stripe-forward');
    expect(t.seen[0]!.headers['x-referalli-signature']).toMatch(/^t=\d+,v1=[0-9a-f]{64}$/);
    expect(t.seen[0]!.headers.authorization).toBeUndefined();
  });

  it('skips unused types without a request', async () => {
    const t = opts(() => new Response('{}'));
    expect(await forwardStripeEvent(event('customer.created'), t.opts)).toEqual({ status: 'skipped' });
    expect(t.seen).toHaveLength(0);
  });

  it('classifies failures', async () => {
    for (const s of [500, 503, 408, 429]) expect((await forwardStripeEvent(event('invoice.paid'), opts(() => err(s)).opts)).status).toBe('retry');
    for (const s of [400, 401, 404, 409]) expect(await forwardStripeEvent(event('invoice.paid'), opts(() => err(s)).opts)).toMatchObject({ status: 'skipped', httpStatus: s });
    expect((await forwardStripeEvent(event('invoice.paid'), opts(() => new Error('down')).opts)).status).toBe('retry');
  });

  it('skips with a message when the env is missing', async () => {
    const r = await forwardStripeEvent(event('invoice.paid'), { connectionId: '', secret: '' });
    expect(r.status).toBe('skipped');
    expect(r.error).toContain('REFERALLI_BILLING_SECRET');
  });
});
