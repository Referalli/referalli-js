import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createOutbox, memoryOutboxStore, Referalli, type GenericBillingEvent } from '../src/index.js';

const event = (id: string): GenericBillingEvent => ({
  providerEventId: id,
  type: 'invoice_paid',
  customerRef: 'user_1',
  amountGross: 4900,
  currency: 'usd',
  occurredAt: '2026-11-03T10:00:00.000Z',
});

type Seen = { url: string; headers: Record<string, string>; body: string };

function server(statuses: number[]) {
  const seen: Seen[] = [];
  const fetch = async (url: string, init: RequestInit) => {
    seen.push({ url, headers: init.headers as Record<string, string>, body: init.body as string });
    const status = statuses.shift() ?? 200;
    return new Response(JSON.stringify(status < 300 ? { received: 1, results: [] } : { error: { code: 'unavailable', message: 'down' } }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  };
  return { fetch, seen };
}

describe('createOutbox', () => {
  it('sends with the API key and a stable idempotency key, then removes the entry', async () => {
    const { fetch, seen } = server([200]);
    const store = memoryOutboxStore();
    const outbox = createOutbox({ store, connectionId: 'bcon_1', client: new Referalli({ apiKey: 'rk_test', fetch }) });
    await outbox.enqueue(event('in_1'));
    expect(await outbox.flush()).toEqual({ sent: 1, failed: 0, gaveUp: 0 });
    expect(seen[0]!.url).toBe('https://referalli.com/v1/billing/connections/bcon_1/events');
    expect(seen[0]!.headers['idempotency-key']).toBe('outbox:bcon_1:in_1');
    expect(JSON.parse(seen[0]!.body)).toEqual({ events: [event('in_1')] });
    expect(store.entries()).toEqual([]);
  });

  it('keeps a failed event and retries it after the backoff, without client retries', async () => {
    let t = 1_000_000;
    const { fetch, seen } = server([503, 200]);
    const store = memoryOutboxStore();
    const outbox = createOutbox({ store, connectionId: 'bcon_1', client: new Referalli({ apiKey: 'rk_test', fetch }), now: () => t, baseDelayMs: 1000 });
    await outbox.enqueue(event('in_1'));
    expect(await outbox.flush()).toEqual({ sent: 0, failed: 1, gaveUp: 0 });
    expect(seen).toHaveLength(1);
    const [entry] = store.entries();
    expect(entry!.attempts).toBe(1);
    expect(entry!.lastError).toContain('503');
    expect(entry!.nextAttemptAt).toBeGreaterThan(t);
    expect(await outbox.flush()).toEqual({ sent: 0, failed: 0, gaveUp: 0 }); // not due yet
    t += 1000;
    expect(await outbox.flush()).toEqual({ sent: 1, failed: 0, gaveUp: 0 });
    expect(seen[1]!.headers['idempotency-key']).toBe(seen[0]!.headers['idempotency-key']);
    expect(store.entries()).toEqual([]);
  });

  it('refuses at enqueue what the server could only refuse', async () => {
    const outbox = createOutbox({ store: memoryOutboxStore(), connectionId: 'bcon_1', client: new Referalli({ apiKey: 'rk_test', fetch: server([]).fetch }) });
    const bad: Array<[Partial<GenericBillingEvent>, RegExp]> = [
      [{ type: 'nope' as never }, /unknown type/],
      [{ amountGross: -1.5 }, /amountGross/],
      [{ occurredAt: undefined as never }, /occurredAt/],
      [{ occurredAt: 'yesterday' }, /occurredAt/],
      [{ currency: 'dollars' }, /currency/],
      [{ currency: 'zzz' }, /currency/],
      [{ amountGross: -100 }, /negative/],
      [{ customerRef: undefined }, /customerRef/],
    ];
    for (const [over, why] of bad) await expect(outbox.enqueue({ ...event('in_1'), ...over })).rejects.toThrow(why);
    await outbox.enqueue({ ...event('in_2'), type: 'refund', customerRef: undefined, invoiceRef: 'in_2' });
    await outbox.enqueue({ ...event('in_3'), type: 'dispute', customerRef: undefined, metadata: { chargeRef: 'ch_1' } });
  });

  it.each([400, 422])('a %i goes straight to dead and reports it, on both send paths', async (status) => {
    for (const via of ['client', 'secret'] as const) {
      const { fetch, seen } = server([status]);
      const store = memoryOutboxStore();
      const dead: string[] = [];
      const outbox = createOutbox({
        store,
        connectionId: 'bcon_1',
        ...(via === 'client' ? { client: new Referalli({ apiKey: 'rk_test', fetch }) } : { secret: 's', fetch }),
        onDead: (e) => void dead.push(e.id),
      });
      await outbox.enqueue(event('in_1'));
      expect(await outbox.flush()).toMatchObject({ gaveUp: 1, failed: 0 });
      expect(seen).toHaveLength(1);
      expect(dead).toEqual(['in_1']);
      expect(store.entries()[0]!.nextAttemptAt).toBeNull();
    }
  });

  it.each([401, 403, 404, 429, 500])('a %i keeps retrying', async (status) => {
    const { fetch } = server([status]);
    const outbox = createOutbox({ store: memoryOutboxStore(), connectionId: 'bcon_1', secret: 's', fetch });
    await outbox.enqueue(event('in_1'));
    expect(await outbox.flush()).toMatchObject({ failed: 1, gaveUp: 0 });
  });

  it('gives up after maxAttempts and leaves the entry in the store', async () => {
    let t = 0;
    const { fetch } = server([500, 500]);
    const store = memoryOutboxStore();
    const outbox = createOutbox({ store, connectionId: 'bcon_1', client: new Referalli({ apiKey: 'rk_test', fetch }), now: () => t, maxAttempts: 2, baseDelayMs: 10 });
    await outbox.enqueue(event('in_1'));
    await outbox.flush();
    t += 1000;
    expect(await outbox.flush()).toEqual({ sent: 0, failed: 0, gaveUp: 1 });
    expect(store.entries()).toMatchObject([{ id: 'in_1', attempts: 2, nextAttemptAt: null }]);
    t += 1_000_000;
    expect(await outbox.flush()).toEqual({ sent: 0, failed: 0, gaveUp: 0 });
  });

  it('signs events for the webhook route when given the connection secret', async () => {
    const { fetch, seen } = server([200]);
    const outbox = createOutbox({ store: memoryOutboxStore(), connectionId: 'bcon_1', secret: 'whsec_x', baseUrl: 'https://api.test/', fetch });
    await outbox.enqueue(event('in_1'));
    await outbox.flush();
    expect(seen[0]!.url).toBe('https://api.test/webhooks/billing/bcon_1');
    expect(seen[0]!.headers['x-webhook-signature']).toBe(createHmac('sha256', 'whsec_x').update(seen[0]!.body).digest('hex'));
  });

  it('queues an event id once and shares one run between concurrent flushes', async () => {
    const { fetch, seen } = server([200]);
    const store = memoryOutboxStore();
    const outbox = createOutbox({ store, connectionId: 'bcon_1', client: new Referalli({ apiKey: 'rk_test', fetch }) });
    await outbox.enqueue(event('in_1'));
    await outbox.enqueue({ ...event('in_1'), amountGross: 1 });
    expect(store.entries()[0]!.event.amountGross).toBe(4900);
    const [a, b] = await Promise.all([outbox.flush(), outbox.flush()]);
    expect(a).toBe(b);
    expect(seen).toHaveLength(1);
    await expect(outbox.enqueue({ ...event(''), providerEventId: '' })).rejects.toThrow(/providerEventId/);
  });
});
