import { DEFAULT_BASE_URL, Referalli } from './client.js';
import { hmacSha256 } from './sha256.js';

/** One event for a `generic` billing connection (amounts in integer minor units). */
export interface GenericBillingEvent {
  /** Your id for this event: Referalli records it once, so resending is safe. */
  providerEventId: string;
  type: 'invoice_paid' | 'sub_created' | 'sub_updated' | 'refund' | 'dispute' | 'sub_canceled' | 'customer_updated';
  customerRef?: string;
  subscriptionRef?: string;
  invoiceRef?: string;
  productRef?: string;
  amountGross?: number;
  tax?: number;
  fees?: number;
  currency?: string;
  mrrDelta?: number;
  /** ISO 8601 instant. */
  occurredAt: string;
  metadata?: Record<string, unknown>;
  linkedCustomerRef?: string;
  customerEmail?: string;
  productIds?: string[];
  priceIds?: string[];
  skus?: string[];
}

/** A queued event. Times are epoch milliseconds. */
export interface OutboxEntry {
  /** The event's `providerEventId`. */
  id: string;
  event: GenericBillingEvent;
  attempts: number;
  /** `null` once the outbox gave up on it. */
  nextAttemptAt: number | null;
  lastError: string | null;
}

/**
 * Where the outbox keeps events. Back it with a table in your own database so
 * a queued payment survives restarts (see the docs for a Postgres example).
 */
export interface OutboxStore {
  /** Save an entry. An entry with the same id already queued is kept as it is. */
  add(entry: OutboxEntry): Promise<void>;
  /** Up to `limit` entries still to send whose `nextAttemptAt <= now`, oldest first. */
  due(now: number, limit: number): Promise<OutboxEntry[]>;
  /** Referalli accepted it: delete the entry (or mark it sent). */
  markSent(id: string): Promise<void>;
  /** A failed attempt. `nextAttemptAt: null` means give up: keep the entry, but `due` no longer returns it. */
  markFailed(id: string, update: { attempts: number; nextAttemptAt: number | null; lastError: string }): Promise<void>;
}

export interface OutboxOptions {
  store: OutboxStore;
  /** The `generic` billing connection (`bcon_…`). */
  connectionId: string;
  /**
   * The connection's webhook secret: events go to the signed
   * `POST /webhooks/billing/{connectionId}`. Without it they go to
   * `POST /v1/billing/connections/{id}/events` with `client`'s API key.
   */
  secret?: string;
  /** Default `new Referalli()` (reads `REFERALLI_API_KEY`). */
  client?: Referalli;
  /** The signed route's host. Default `client.baseUrl`, then https://referalli.com. */
  baseUrl?: string;
  /** The signed route's fetch. Default the global fetch. */
  fetch?: (url: string, init: RequestInit) => Promise<Response>;
  /** Attempts before an event is given up on (kept in the store). Default 50, about two days with the default delays. */
  maxAttempts?: number;
  /** First retry delay in ms; doubles per attempt, with jitter. Default 30 000. */
  baseDelayMs?: number;
  /** Longest retry delay in ms. Default 3 600 000 (1 hour). */
  maxDelayMs?: number;
  /** Clock for tests. Default `Date.now`. */
  now?: () => number;
}

export interface FlushResult {
  sent: number;
  /** Failed this round; retried later. */
  failed: number;
  /** Failed for the last time; left in the store with `nextAttemptAt: null`. */
  gaveUp: number;
}

export interface Outbox {
  /** Queue an event durably. Then call `flush()` (right away, and on a timer). */
  enqueue(event: GenericBillingEvent): Promise<void>;
  /** Send every due event, one at a time. Concurrent calls share one run. */
  flush(options?: { limit?: number }): Promise<FlushResult>;
}

/**
 * A durable queue for billing events, so an outage longer than the client's
 * own retries does not lose a payment:
 *
 *   const outbox = createOutbox({ store, connectionId: 'bcon_…', secret: process.env.REFERALLI_BILLING_SECRET });
 *   await outbox.enqueue({ providerEventId: invoice.id, type: 'invoice_paid', ... });
 *   void outbox.flush();
 *   setInterval(() => void outbox.flush(), 60_000);
 *
 * Every send carries the event's `providerEventId`, so a redelivery (two
 * workers, a crash after sending) is recorded once.
 */
export function createOutbox(options: OutboxOptions): Outbox {
  const { store, connectionId, secret } = options;
  const now = options.now ?? Date.now;
  const maxAttempts = options.maxAttempts ?? 50;
  const baseDelay = options.baseDelayMs ?? 30_000;
  const maxDelay = options.maxDelayMs ?? 3_600_000;
  let client = options.client;
  const api = () => (client ??= new Referalli());

  const send = async (event: GenericBillingEvent): Promise<void> => {
    if (!secret) {
      // maxRetries 0: the outbox does the waiting, so a flush never blocks on backoff.
      await api().billing.connections.events(
        connectionId,
        { events: [event as unknown as Record<string, unknown>] },
        { idempotencyKey: `outbox:${connectionId}:${event.providerEventId}`, maxRetries: 0 },
      );
      return;
    }
    const body = JSON.stringify({ events: [event] });
    const signature = toHex(hmacSha256(new TextEncoder().encode(secret), new TextEncoder().encode(body)));
    const base = (options.baseUrl ?? options.client?.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    const res = await (options.fetch ?? ((url: string, init: RequestInit) => globalThis.fetch(url, init)))(`${base}/webhooks/billing/${encodeURIComponent(connectionId)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-webhook-signature': signature },
      body,
    });
    if (!res.ok) throw new Error(`POST /webhooks/billing/${connectionId} answered ${res.status}: ${(await res.text().catch(() => '')).slice(0, 500)}`);
  };

  const delay = (attempts: number) => Math.min(baseDelay * 2 ** (attempts - 1), maxDelay) * (0.75 + Math.random() * 0.25);

  const run = async (limit: number): Promise<FlushResult> => {
    const result: FlushResult = { sent: 0, failed: 0, gaveUp: 0 };
    for (const entry of await store.due(now(), limit)) {
      try {
        await send(entry.event);
      } catch (err) {
        // Every failure is retried (a paused connection, a rotated key, an outage): only maxAttempts stops it.
        const attempts = entry.attempts + 1;
        const giveUp = attempts >= maxAttempts;
        await store.markFailed(entry.id, {
          attempts,
          nextAttemptAt: giveUp ? null : now() + delay(attempts),
          lastError: err instanceof Error ? err.message : String(err),
        });
        if (giveUp) result.gaveUp++;
        else result.failed++;
        continue;
      }
      await store.markSent(entry.id);
      result.sent++;
    }
    return result;
  };

  let running: Promise<FlushResult> | null = null;
  return {
    async enqueue(event) {
      if (!event?.providerEventId) throw new TypeError('createOutbox: an event needs a providerEventId');
      await store.add({ id: event.providerEventId, event, attempts: 0, nextAttemptAt: now(), lastError: null });
    },
    flush({ limit = 100 } = {}) {
      running ??= run(limit).finally(() => {
        running = null;
      });
      return running;
    },
  };
}

/** An in-memory `OutboxStore`, for tests and scripts. It does not survive a restart. */
export function memoryOutboxStore(): OutboxStore & { entries(): OutboxEntry[] } {
  const rows = new Map<string, OutboxEntry>();
  return {
    async add(entry) {
      if (!rows.has(entry.id)) rows.set(entry.id, { ...entry });
    },
    async due(at, limit) {
      return [...rows.values()]
        .filter((e): e is OutboxEntry & { nextAttemptAt: number } => e.nextAttemptAt !== null && e.nextAttemptAt <= at)
        .sort((a, b) => a.nextAttemptAt - b.nextAttemptAt)
        .slice(0, limit)
        .map((e) => ({ ...e }));
    },
    async markSent(id) {
      rows.delete(id);
    },
    async markFailed(id, u) {
      const e = rows.get(id);
      if (!e) return;
      Object.assign(e, u);
    },
    entries() {
      return [...rows.values()].map((e) => ({ ...e }));
    },
  };
}

function toHex(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += b.toString(16).padStart(2, '0');
  return s;
}
