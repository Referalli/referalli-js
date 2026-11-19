import { describe, expect, it, vi } from 'vitest';
import { buildBillingEvent, createOutbox, pgOutboxStore, stripeEventToBillingEvents, Referalli, type GenericBillingEvent, type PgQuery } from '../src/index.js';

const event = (id: string): GenericBillingEvent => ({ providerEventId: id, type: 'invoice_paid', customerRef: 'user_1', amountGross: 4900, currency: 'usd', occurredAt: '2026-11-03T10:00:00.000Z' });

/** Stands in for one Postgres table: each call is atomic, as one statement is. It does not run the SQL. */
function fakePg() {
  const rows = new Map<string, any>();
  const log: string[] = [];
  const query: PgQuery = async (sql, p) => {
    log.push(sql);
    await Promise.resolve(); // let other "replicas" interleave
    if (sql.startsWith('INSERT')) {
      if (!rows.has(p[0] as string)) rows.set(p[0] as string, { id: p[0], event: JSON.parse(p[1] as string), attempts: p[2], next_attempt_at: String(p[3]), last_error: p[4] });
      return { rows: [] };
    }
    if (sql.startsWith('WITH due')) {
      const [row] = [...rows.values()].filter((r) => r.next_attempt_at !== null && Number(r.next_attempt_at) <= (p[0] as number)).sort((a, b) => Number(a.next_attempt_at) - Number(b.next_attempt_at));
      if (!row) return { rows: [] };
      row.next_attempt_at = String(p[1]);
      return { rows: [{ ...row }] };
    }
    if (sql.startsWith('DELETE')) rows.delete(p[0] as string);
    if (sql.startsWith('UPDATE')) {
      expect(Number.isInteger(p[2] ?? 0)).toBe(true); // a bigint column refuses a fraction
      Object.assign(rows.get(p[0] as string), { attempts: p[1], next_attempt_at: p[2] === null ? null : String(p[2]), last_error: p[3] });
    }
    if (sql.startsWith('SELECT') && sql.includes('IS NULL')) return { rows: [...rows.values()].filter((r) => r.next_attempt_at === null) };
    return { rows: [] };
  };
  return { query, rows, log };
}

function api(status = () => 200) {
  const sent: string[] = [];
  const fetch = async (_url: string, init: RequestInit) => {
    sent.push(JSON.parse(init.body as string).events[0].providerEventId);
    const s = status();
    return new Response(JSON.stringify(s < 300 ? { received: 1, results: [] } : { error: { code: 'unavailable', message: 'down' } }), { status: s, headers: { 'content-type': 'application/json' } });
  };
  return { sent, client: new Referalli({ apiKey: 'rk_test', fetch }) };
}

describe('pgOutboxStore', () => {
  it('claims with FOR UPDATE SKIP LOCKED and creates the documented columns', async () => {
    const { query, log } = fakePg();
    const store = pgOutboxStore({ query, table: 'referalli_outbox' });
    await store.migrate();
    await store.claim(1, 2);
    expect(log[0]).toMatch(/CREATE TABLE IF NOT EXISTS referalli_outbox/);
    for (const column of ['id text PRIMARY KEY', 'event jsonb', 'attempts int', 'next_attempt_at bigint', 'last_error text']) expect(log[0]).toContain(column);
    expect(log[1]).toMatch(/LIMIT 1 FOR UPDATE SKIP LOCKED/);
  });

  it('sends event JSON as text, so no driver double-encodes it', async () => {
    const seen: unknown[][] = [];
    const store = pgOutboxStore({ query: async (sql, p) => (seen.push([sql, ...p]), { rows: [] }), table: 't' });
    await store.add({ id: 'a', event: event('a'), attempts: 0, nextAttemptAt: 5, lastError: null });
    expect(seen[0]![0]).toContain('$2::text::jsonb');
    expect(typeof seen[0]![2]).toBe('string');
  });

  it.each(['a b', 'x;drop table y', 'public.t', '"t"', '', '1t'])('refuses table name %j', (table) => {
    expect(() => pgOutboxStore({ query: fakePg().query, table })).toThrow(/plain identifier/);
  });

  it('a restart delivers an event queued before the crash, once', async () => {
    const { query } = fakePg();
    const { sent, client } = api();
    await createOutbox({ store: pgOutboxStore({ query, table: 't' }), connectionId: 'bcon_1', client }).enqueue(event('in_1'));
    // New process, same table.
    const after = createOutbox({ store: pgOutboxStore({ query, table: 't' }), connectionId: 'bcon_1', client });
    expect(await after.flush()).toEqual({ sent: 1, failed: 0, gaveUp: 0 });
    expect(await after.flush()).toEqual({ sent: 0, failed: 0, gaveUp: 0 });
    expect(sent).toEqual(['in_1']);
  });

  it('reclaims a row whose process died holding the claim, only after the lease', async () => {
    let t = 1_000;
    const { query, rows } = fakePg();
    const { sent, client } = api();
    const store = pgOutboxStore({ query, table: 't' });
    const outbox = createOutbox({ store, connectionId: 'bcon_1', client, now: () => t });
    await outbox.enqueue(event('in_1'));
    expect((await store.claim(t, 300_000))!.id).toBe('in_1'); // the process that dies right here
    expect(await outbox.flush()).toEqual({ sent: 0, failed: 0, gaveUp: 0 });
    t += 300_000;
    expect(await outbox.flush()).toEqual({ sent: 1, failed: 0, gaveUp: 0 });
    expect(sent).toEqual(['in_1']);
    expect(rows.size).toBe(0);
  });

  it('two replicas flushing the same table send each row once', async () => {
    const { query } = fakePg();
    const { sent, client } = api();
    const make = () => createOutbox({ store: pgOutboxStore({ query, table: 't' }), connectionId: 'bcon_1', client });
    const [a, b] = [make(), make()];
    for (let i = 0; i < 20; i++) await a.enqueue(event(`in_${i}`));
    const [ra, rb] = await Promise.all([a.flush(), b.flush()]);
    expect(ra.sent + rb.sent).toBe(20);
    expect(ra.sent).toBeGreaterThan(0);
    expect(rb.sent).toBeGreaterThan(0);
    expect(sent).toHaveLength(20);
    expect(new Set(sent).size).toBe(20);
  });

  it('keeps a capped row inspectable, reports it once and stops sending it', async () => {
    let t = 0;
    const { query, rows } = fakePg();
    const { sent, client } = api(() => 500);
    const store = pgOutboxStore({ query, table: 't' });
    const onDead = vi.fn(() => {
      throw new Error('a broken reporter');
    });
    const outbox = createOutbox({ store, connectionId: 'bcon_1', client, now: () => t, maxAttempts: 2, baseDelayMs: 10, onDead });
    await outbox.enqueue(event('in_1'));
    expect(await outbox.flush()).toEqual({ sent: 0, failed: 1, gaveUp: 0 });
    t += 1000;
    expect(await outbox.flush()).toEqual({ sent: 0, failed: 0, gaveUp: 1 });
    expect(onDead).toHaveBeenCalledTimes(1);
    expect(onDead).toHaveBeenCalledWith(expect.objectContaining({ id: 'in_1', attempts: 2, nextAttemptAt: null, lastError: expect.stringContaining('down') }));
    expect(await store.dead()).toMatchObject([{ id: 'in_1', attempts: 2, nextAttemptAt: null, event: { amountGross: 4900 } }]);
    expect(rows.size).toBe(1);
    t += 1_000_000_000;
    expect(await outbox.flush()).toEqual({ sent: 0, failed: 0, gaveUp: 0 });
    expect(sent).toHaveLength(2);
  });
});

describe('stripeEventToBillingEvents', () => {
  const lookup = { customerRef: (c: string) => (c === 'cus_1' ? 'user_1' : null) };
  const stripe = (type: string, object: object, id = 'evt_1') => ({ id, type, created: 1_790_000_000, data: { object } });
  const occurredAt = new Date(1_790_000_000_000).toISOString();

  it('maps invoice.paid, with the charge a later refund can name', async () => {
    const [e] = await stripeEventToBillingEvents(
      stripe('invoice.paid', {
        id: 'in_1',
        customer: 'cus_1',
        subscription: 'sub_1',
        amount_paid: 4900,
        tax: 100,
        currency: 'USD',
        charge: 'ch_1',
        customer_email: 'a@example.com',
        metadata: { campaign: 'x' },
        lines: { data: [{ price: { id: 'price_1', product: 'prod_1' } }] },
      }),
      lookup,
    );
    expect(e).toEqual({
      providerEventId: 'stripe:evt_1',
      type: 'invoice_paid',
      customerRef: 'user_1',
      subscriptionRef: 'sub_1',
      invoiceRef: 'in_1',
      productRef: 'prod_1',
      productIds: ['prod_1'],
      priceIds: ['price_1'],
      amountGross: 4900,
      tax: 100,
      currency: 'usd',
      customerEmail: 'a@example.com',
      occurredAt,
      metadata: { campaign: 'x', expansion: false, chargeRef: 'ch_1' },
    });
    expect(e).not.toHaveProperty('amountMinor');
  });

  it('reads the newer invoice shape and leaves out an address the API would refuse', async () => {
    const [e] = await stripeEventToBillingEvents(
      stripe('invoice.paid', {
        id: 'in_1',
        customer: { id: 'cus_1' },
        amount_paid: 1,
        currency: 'usd',
        customer_email: 'not an email@x',
        parent: { subscription_details: { subscription: 'sub_1', metadata: { planSource: 'internal' } } },
        payments: { data: [{ payment: { charge: 'ch_1' } }] },
        lines: { data: [{ pricing: { price_details: { price: 'price_1', product: 'prod_1' } } }] },
      }),
      lookup,
    );
    expect(e).toMatchObject({ customerRef: 'user_1', subscriptionRef: 'sub_1', productIds: ['prod_1'], priceIds: ['price_1'], metadata: { chargeRef: 'ch_1', planSource: 'internal' } });
    expect(e!.customerEmail).toBeUndefined();
  });

  it('basil: parent subscription metadata is read even beside an empty top-level one; line metadata fills in; the invoice\'s own wins', async () => {
    const [e] = await stripeEventToBillingEvents(
      stripe('invoice.paid', {
        id: 'in_2',
        customer: 'cus_1',
        amount_paid: 1,
        currency: 'usd',
        subscription_details: { metadata: {} },
        parent: { subscription_details: { subscription: 'sub_2', metadata: { organization_id: 'org_1', plan: 'sub' } } },
        lines: { data: [{ metadata: { organization_id: 'org_line', seat: '3' } }] },
        metadata: { plan: 'invoice' },
      }),
      lookup,
    );
    expect(e).toMatchObject({ subscriptionRef: 'sub_2', metadata: { organization_id: 'org_1', seat: '3', plan: 'invoice' } });
  });

  it('maps charge.refunded to a positive running total, flagged cumulative', async () => {
    const refund = (id: string, amount_refunded: number) => stripe('charge.refunded', { id: 'ch_1', invoice: 'in_1', customer: 'cus_1', amount: 4900, amount_refunded, currency: 'usd' }, id);
    const [first] = await stripeEventToBillingEvents(refund('evt_1', 1000), lookup);
    const [second] = await stripeEventToBillingEvents(refund('evt_2', 2500), lookup);
    expect(first).toMatchObject({ providerEventId: 'stripe:evt_1', type: 'refund', invoiceRef: 'in_1', customerRef: 'user_1', amountGross: 1000, metadata: { chargeRef: 'ch_1', refundCumulative: true } });
    expect(second).toMatchObject({ providerEventId: 'stripe:evt_2', amountGross: 2500, metadata: { refundCumulative: true } });
  });

  it('maps a refund that names only its charge', async () => {
    const [e] = await stripeEventToBillingEvents(stripe('charge.refunded', { id: 'ch_1', customer: 'cus_1', amount_refunded: 4900, currency: 'usd' }), lookup);
    expect(e!.invoiceRef).toBeUndefined();
    expect(e!.metadata).toMatchObject({ chargeRef: 'ch_1' });
  });

  it('maps a dispute by its charge, without a customer lookup', async () => {
    const customerRef = vi.fn(() => 'user_1');
    const [e] = await stripeEventToBillingEvents(stripe('charge.dispute.created', { id: 'dp_1', charge: 'ch_1', amount: 4900, currency: 'usd' }), { customerRef });
    expect(customerRef).not.toHaveBeenCalled();
    expect(e).toMatchObject({ type: 'dispute', amountGross: 4900, metadata: { chargeRef: 'ch_1' } });
    expect(e!.customerRef).toBeUndefined();
    expect(e!.metadata).not.toHaveProperty('stripeCustomerUnmapped');
  });

  it('maps subscriptions created (with trial) and deleted', async () => {
    const sub = { id: 'sub_1', customer: 'cus_1', status: 'trialing', currency: 'usd', items: { data: [{ price: { id: 'price_1', product: 'prod_1', unit_amount: 900 } }] } };
    const [created] = await stripeEventToBillingEvents(stripe('customer.subscription.created', sub), lookup);
    const [deleted] = await stripeEventToBillingEvents(stripe('customer.subscription.deleted', sub), lookup);
    expect(created).toMatchObject({ type: 'sub_created', subscriptionRef: 'sub_1', mrrDelta: 900, customerRef: 'user_1', priceIds: ['price_1'], metadata: { trial: true } });
    expect(deleted).toMatchObject({ type: 'sub_canceled', subscriptionRef: 'sub_1', mrrDelta: -900, customerRef: 'user_1' });
  });

  it('awaits an async lookup; an unmapped customer stays visible under its Stripe id', async () => {
    const [known] = await stripeEventToBillingEvents(stripe('invoice.paid', { id: 'in_1', customer: 'cus_1', amount_paid: 1, currency: 'usd' }), { customerRef: async () => 'user_1' });
    expect(known!.customerRef).toBe('user_1');
    const [unknown] = await stripeEventToBillingEvents(stripe('invoice.paid', { id: 'in_1', customer: 'cus_9', amount_paid: 1, currency: 'usd' }), lookup);
    expect(unknown).toMatchObject({ customerRef: 'cus_9', amountGross: 1, metadata: { stripeCustomerUnmapped: true } });
  });

  it('lets a lookup failure reach the webhook handler, so Stripe retries', async () => {
    await expect(stripeEventToBillingEvents(stripe('invoice.paid', { id: 'in_1', customer: 'cus_1' }), { customerRef: async () => { throw new Error('db down'); } })).rejects.toThrow('db down');
  });

  it('returns nothing for a type it does not map, without a lookup', async () => {
    const customerRef = vi.fn(() => 'user_1');
    expect(await stripeEventToBillingEvents(stripe('customer.updated', { id: 'cus_1', customer: 'cus_1' }), { customerRef })).toEqual([]);
    expect(customerRef).not.toHaveBeenCalled();
  });
});

describe('buildBillingEvent', () => {
  it('returns a valid event and throws on amountMinor', () => {
    expect(buildBillingEvent(event('in_1'))).toEqual(event('in_1'));
    // @ts-expect-error amountMinor is refused at compile time too
    expect(() => buildBillingEvent({ ...event('in_1'), amountMinor: 4900 })).toThrow(/amountGross/);
  });
});
