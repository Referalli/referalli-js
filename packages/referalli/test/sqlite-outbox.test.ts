import { describe, expect, it } from 'vitest';
import { createOutbox, sqliteOutboxStore, stripeEventToBillingEvents, type GenericBillingEvent, type SqlExecute } from '../src/index.js';

// node:sqlite ships with Node 22.13+ (earlier 22.x need a flag): the real-SQLite cases skip where it is missing.
const sqlite = (await import('node:sqlite' as string).catch(() => null)) as { DatabaseSync: new (path: string) => any } | null;

/** The adapter the docs show for node:sqlite / better-sqlite3 style drivers. */
function memoryDb(): SqlExecute {
  const db = new sqlite!.DatabaseSync(':memory:');
  return async (sql, params) => ({ rows: db.prepare(sql).all(...(params as never[])) });
}

const event = (id: string): GenericBillingEvent => ({ providerEventId: id, type: 'invoice_paid', customerRef: 'user_1', amountGross: 4900, currency: 'usd', occurredAt: '2026-11-03T10:00:00.000Z' });

describe('sqliteOutboxStore', () => {
  it.each(['a b', 'x;drop table y', 'main.t', '"t"', '', '1t'])('refuses table name %j', (table) => {
    expect(() => sqliteOutboxStore({ execute: async () => ({ rows: [] }), table })).toThrow(/plain identifier/);
  });

  it('uses ? placeholders and sends the event as JSON text', async () => {
    const seen: Array<[string, unknown[]]> = [];
    const store = sqliteOutboxStore({ execute: async (sql, p) => (seen.push([sql, p]), { rows: [] }), table: 'referalli_outbox' });
    await store.add({ id: 'a', event: event('a'), attempts: 0, nextAttemptAt: 5, lastError: null });
    expect(seen[0]![0]).toMatch(/^INSERT OR IGNORE INTO referalli_outbox .* VALUES \(\?, \?, \?, \?, \?\)$/);
    expect(JSON.parse(seen[0]![1][1] as string)).toEqual(event('a'));
  });

  describe.skipIf(!sqlite)('on a real SQLite database', () => {
    it('keeps an entry once, claims it with a lease, retries and gives up', async () => {
      const store = sqliteOutboxStore({ execute: memoryDb(), table: 'referalli_outbox' });
      await store.migrate();
      await store.migrate(); // idempotent
      await store.add({ id: 'in_1', event: event('in_1'), attempts: 0, nextAttemptAt: 100, lastError: null });
      await store.add({ id: 'in_1', event: event('other'), attempts: 0, nextAttemptAt: 1, lastError: null });
      expect(await store.due(100, 10)).toEqual([{ id: 'in_1', event: event('in_1'), attempts: 0, nextAttemptAt: 100, lastError: null }]);

      // A claim hides the row until the lease ends.
      expect((await store.claim(100, 1000))?.id).toBe('in_1');
      expect(await store.claim(100, 1000)).toBeNull();
      expect((await store.claim(1100, 1000))?.nextAttemptAt).toBe(2100);

      await store.markFailed('in_1', { attempts: 1, nextAttemptAt: null, lastError: 'gave up' });
      expect(await store.due(1e15, 10)).toEqual([]);
      expect(await store.dead()).toMatchObject([{ id: 'in_1', attempts: 1, nextAttemptAt: null, lastError: 'gave up' }]);
      await store.markSent('in_1');
      expect(await store.dead()).toEqual([]);
    });

    it('forwards a Stripe payment, refund and dispute through createOutbox in a few lines', async () => {
      const sent: string[] = [];
      const fetch = async (_url: string, init: RequestInit) => {
        sent.push(...JSON.parse(init.body as string).events.map((e: GenericBillingEvent) => e.type));
        return new Response('{"received":1,"results":[]}', { status: 200 });
      };
      const store = sqliteOutboxStore({ execute: memoryDb(), table: 'referalli_outbox' });
      await store.migrate();
      const outbox = createOutbox({ store, connectionId: 'bcon_1', secret: 'whsec_test', fetch });
      const stripe = [
        { id: 'evt_1', type: 'invoice.paid', created: 1762862400, data: { object: { id: 'in_1', customer: 'cus_1', amount_paid: 4900, currency: 'usd', charge: 'ch_1' } } },
        { id: 'evt_2', type: 'charge.refunded', created: 1762862500, data: { object: { id: 'ch_1', customer: 'cus_1', amount_refunded: 4900, currency: 'usd', invoice: 'in_1' } } },
        { id: 'evt_3', type: 'charge.dispute.created', created: 1762862600, data: { object: { id: 'dp_1', charge: 'ch_1', amount: 4900, currency: 'usd' } } },
      ];
      for (const e of stripe) for (const mapped of await stripeEventToBillingEvents(e, { customerRef: () => 'org_42' })) await outbox.enqueue(mapped);
      expect(await outbox.flush()).toEqual({ sent: 3, failed: 0, gaveUp: 0 });
      expect(sent).toEqual(['invoice_paid', 'refund', 'dispute']);
      expect(await store.due(Date.now() + 1e9, 10)).toEqual([]);
    });
  });
});
