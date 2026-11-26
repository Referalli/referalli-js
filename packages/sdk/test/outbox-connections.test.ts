import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createOutbox, memoryOutboxStore, Referalli, stripeEventToBillingEvents, type GenericBillingEvent } from '../src/index.js';

const event = (id: string): GenericBillingEvent => ({
  providerEventId: id,
  type: 'invoice_paid',
  customerRef: 'user_1',
  amountGross: 4900,
  currency: 'usd',
  occurredAt: '2026-11-25T10:00:00.000Z',
});

function server() {
  const seen: Array<{ url: string; headers: Record<string, string>; body: string }> = [];
  const fetch = async (url: string, init: RequestInit) => {
    seen.push({ url, headers: init.headers as Record<string, string>, body: init.body as string });
    return new Response(JSON.stringify({ received: 1, results: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  return { fetch, seen };
}
const sign = (secret: string, body: string) => createHmac('sha256', secret).update(body).digest('hex');

describe('createOutbox with several connections (RF-I3)', () => {
  it("signs each event with its own connection's secret from a map, and never sends connectionId", async () => {
    const { fetch, seen } = server();
    const outbox = createOutbox({ store: memoryOutboxStore(), connectionId: 'bcon_main', secret: 'whsec_main', secrets: { bcon_shopA: 'whsec_a', bcon_shopB: 'whsec_b' }, fetch });
    await outbox.enqueue({ ...event('in_a'), connectionId: 'bcon_shopA' });
    await outbox.enqueue({ ...event('in_b'), connectionId: 'bcon_shopB' });
    await outbox.enqueue(event('in_main'));
    expect(await outbox.flush()).toEqual({ sent: 3, failed: 0, gaveUp: 0 });
    const by = (id: string) => seen.find((s) => JSON.parse(s.body).events[0].providerEventId === id)!;
    for (const [id, conn, secret] of [['in_a', 'bcon_shopA', 'whsec_a'], ['in_b', 'bcon_shopB', 'whsec_b'], ['in_main', 'bcon_main', 'whsec_main']] as const) {
      const s = by(id);
      expect(s.url).toBe(`https://referalli.com/webhooks/billing/${conn}`);
      expect(s.headers['x-webhook-signature']).toBe(sign(secret, s.body));
      expect(JSON.parse(s.body)).toEqual({ events: [event(id)] });
    }
  });

  it('takes a resolver function, and needs no outbox connectionId when every event names one', async () => {
    const { fetch, seen } = server();
    const asked: string[] = [];
    const outbox = createOutbox({ store: memoryOutboxStore(), secrets: async (id) => {
      asked.push(id);
      return `whsec_${id}`;
    }, fetch });
    await outbox.enqueue({ ...event('in_1'), connectionId: 'bcon_x' });
    await expect(outbox.enqueue(event('in_2'))).rejects.toThrow(/names no connectionId/);
    expect(await outbox.flush()).toEqual({ sent: 1, failed: 0, gaveUp: 0 });
    expect(asked).toEqual(['bcon_x']);
    expect(seen[0]!.headers['x-webhook-signature']).toBe(sign('whsec_bcon_x', seen[0]!.body));
  });

  it('a connection with no secret goes with the API key, to its own connection', async () => {
    const { fetch, seen } = server();
    const outbox = createOutbox({ store: memoryOutboxStore(), connectionId: 'bcon_main', secrets: {}, client: new Referalli({ apiKey: 'rk_test', fetch }) });
    await outbox.enqueue({ ...event('in_k'), connectionId: 'bcon_other' });
    expect(await outbox.flush()).toEqual({ sent: 1, failed: 0, gaveUp: 0 });
    expect(seen[0]!.url).toBe('https://referalli.com/v1/billing/connections/bcon_other/events');
    expect(seen[0]!.headers['idempotency-key']).toBe('outbox:bcon_other:in_k');
    expect(JSON.parse(seen[0]!.body)).toEqual({ events: [event('in_k')] });
  });
});

describe('stripeEventToBillingEvents on newer API versions (RF-I5)', () => {
  it("reads an expanded invoice's payments for the charge and payment intent", async () => {
    const [mapped] = await stripeEventToBillingEvents(
      {
        id: 'evt_1',
        type: 'invoice.paid',
        created: 1_764_072_000,
        data: { object: { id: 'in_1', customer: 'cus_1', amount_paid: 4900, currency: 'usd', payments: { data: [{ status: 'open', payment: { payment_intent: 'pi_failed' } }, { status: 'paid', payment: { type: 'payment_intent', payment_intent: 'pi_1', charge: 'ch_1' } }] } } },
      },
      { customerRef: () => 'user_1' },
    );
    expect(mapped!.metadata).toMatchObject({ chargeRef: 'ch_1', paymentIntentRef: 'pi_1' });
  });
});
