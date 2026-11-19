import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Referalli } from '../src/index.js';

describe('signWith', () => {
  it('signs the exact bytes sent, sends no Authorization, and needs no API key', async () => {
    const seen: { headers: Record<string, string>; body: string }[] = [];
    const fetch = async (_url: string, init: RequestInit) => {
      seen.push({ headers: init.headers as Record<string, string>, body: init.body as string });
      return new Response('{"received":1}', { status: 200, headers: { 'content-type': 'application/json' } });
    };
    const referalli = new Referalli({ apiKey: 'rk_live_should_not_be_sent', fetch });
    const event = { id: 'evt_1', type: 'invoice.paid', created: 1, data: { object: { id: 'in_1', livemode: true } }, api_version: '2025-01-01' };
    await referalli.billing.connections.stripeForward('bc_1', event, undefined, { signWith: 'whsec_x' });
    const { headers, body } = seen[0]!;
    expect(headers.authorization).toBeUndefined();
    expect(body).toBe(JSON.stringify(event));
    const m = /^t=(\d+),v1=([0-9a-f]{64})$/.exec(headers['x-referalli-signature']!);
    expect(m).not.toBeNull();
    expect(Math.abs(Date.now() / 1000 - Number(m![1]))).toBeLessThan(5);
    expect(m![2]).toBe(createHmac('sha256', 'whsec_x').update(`${m![1]}.${body}`).digest('hex'));
  });

  it('works with the API key unset', async () => {
    const saved = process.env.REFERALLI_API_KEY;
    delete process.env.REFERALLI_API_KEY;
    try {
      let auth: string | undefined = 'unset';
      const fetch = async (_u: string, init: RequestInit) => {
        auth = (init.headers as Record<string, string>).authorization;
        return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
      };
      await new Referalli({ fetch }).billing.connections.stripeForward('bc_1', { id: 'e', type: 'x', created: 1, data: { object: {} } }, { signWith: 's' });
      expect(auth).toBeUndefined();
    } finally {
      if (saved !== undefined) process.env.REFERALLI_API_KEY = saved;
    }
  });
});
