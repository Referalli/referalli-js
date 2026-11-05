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

const EVENT_TYPES = new Set(['invoice_paid', 'sub_created', 'sub_updated', 'refund', 'dispute', 'sub_canceled', 'customer_updated']);

/** The server's rules for a generic event: what fails here could only ever be refused later, after the caller has moved on. */
function assertSendable(e: GenericBillingEvent): void {
  const refuse = (why: string) => new TypeError(`createOutbox: event ${e.providerEventId}: ${why}`);
  if (!EVENT_TYPES.has(e.type)) throw refuse(`unknown type ${String(e.type)}`);
  if (typeof e.occurredAt !== 'string' || Number.isNaN(Date.parse(e.occurredAt))) throw refuse('occurredAt must be an ISO 8601 instant');
  for (const k of ['amountGross', 'tax', 'fees', 'mrrDelta'] as const) {
    if (e[k] !== undefined && !Number.isInteger(e[k])) throw refuse(`${k} must be an integer in minor units`);
  }
  if (e.currency !== undefined && e.currency.length !== 3) throw refuse('currency must be a 3-letter code');
  const chargeRef = e.metadata?.chargeRef;
  if (!e.customerRef && !((e.type === 'refund' || e.type === 'dispute') && (e.invoiceRef || chargeRef))) {
    throw refuse('customerRef is required (a refund or dispute may send only invoiceRef or metadata.chargeRef)');
  }
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
  /**
   * Optional: atomically take the oldest due entry for `leaseMs`, so other
   * workers skip it and it comes due again if this process dies. When present,
   * `flush` uses it instead of `due`.
   */
  claim?(now: number, leaseMs: number): Promise<OutboxEntry | null>;
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
  /** Called when an event hits `maxAttempts`, after it is marked dead in the store. A throw here is ignored. */
  onDead?: (entry: OutboxEntry) => void | Promise<void>;
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

const SEND_TIMEOUT_MS = 60_000;
/** Longer than a send can take, so a live worker's claim never expires under it. */
const LEASE_MS = 5 * 60_000;

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
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (!res.ok) throw Object.assign(new Error(`POST /webhooks/billing/${connectionId} answered ${res.status}: ${(await res.text().catch(() => '')).slice(0, 500)}`), { status: res.status });
  };

  // Whole milliseconds: a fraction is refused by a bigint column.
  const delay = (attempts: number) => Math.round(Math.min(baseDelay * 2 ** (attempts - 1), maxDelay) * (0.75 + Math.random() * 0.25));

  const run = async (limit: number): Promise<FlushResult> => {
    const result: FlushResult = { sent: 0, failed: 0, gaveUp: 0 };
    const attempt = async (entry: OutboxEntry) => {
      try {
        await send(entry.event);
      } catch (err) {
        // A paused connection, a rotated key or an outage can recover, so those retry up to maxAttempts.
        // A refused event never will: resending the same bytes gets the same 400.
        const attempts = entry.attempts + 1;
        const status = (err as { status?: unknown } | null)?.status;
        const giveUp = attempts >= maxAttempts || status === 400 || status === 422;
        const lastError = err instanceof Error ? err.message : String(err);
        const nextAttemptAt = giveUp ? null : now() + delay(attempts);
        await store.markFailed(entry.id, { attempts, nextAttemptAt, lastError });
        if (!giveUp) {
          result.failed++;
          return;
        }
        result.gaveUp++;
        try {
          await options.onDead?.({ ...entry, attempts, nextAttemptAt, lastError });
        } catch {
          // The entry is safe in the store; a broken reporter must not stop the flush.
        }
        return;
      }
      await store.markSent(entry.id);
      result.sent++;
    };
    if (store.claim) {
      // One at a time, so the lease only has to outlast one send rather than a whole batch.
      for (let i = 0; i < limit; i++) {
        const entry = await store.claim(now(), LEASE_MS);
        if (!entry) break;
        await attempt(entry);
      }
    } else {
      for (const entry of await store.due(now(), limit)) await attempt(entry);
    }
    return result;
  };

  let running: Promise<FlushResult> | null = null;
  return {
    async enqueue(event) {
      if (!event?.providerEventId) throw new TypeError('createOutbox: an event needs a providerEventId');
      assertSendable(event);
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

/** A query function shaped like node-postgres's `pool.query`. */
export type PgQuery = (sql: string, params: unknown[]) => Promise<{ rows: any[] }>;

const fromRow = (r: any): OutboxEntry => ({
  id: r.id,
  event: r.event,
  attempts: r.attempts,
  nextAttemptAt: r.next_attempt_at === null ? null : Number(r.next_attempt_at),
  lastError: r.last_error,
});

/**
 * An `OutboxStore` on a Postgres table, through your own query function, for
 * several replicas:
 *
 *   const store = pgOutboxStore({ query: (sql, params) => pool.query(sql, params), table: 'referalli_outbox' });
 *   await store.migrate();
 *
 * Columns: `id` text primary key (the providerEventId), `event` jsonb,
 * `attempts` int, `next_attempt_at` bigint (epoch ms; null = dead),
 * `last_error` text. A sent row is deleted; a dead row stays until you remove
 * or requeue it (`store.dead()` lists them).
 */
export function pgOutboxStore(options: { query: PgQuery; table: string }): OutboxStore & {
  claim(now: number, leaseMs: number): Promise<OutboxEntry | null>;
  /** Create the table and its index if missing. Safe from replicas booting together. */
  migrate(): Promise<void>;
  /** Entries that hit the attempt cap. */
  dead(): Promise<OutboxEntry[]>;
} {
  const { query, table: t } = options;
  // It goes into the SQL text, so nothing but a plain identifier gets through.
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(t)) throw new TypeError(`pgOutboxStore: table must be a plain identifier, got ${JSON.stringify(t)}`);
  const columns = 'id, event, attempts, next_attempt_at, last_error';
  return {
    async migrate() {
      // One statement, so it runs in one transaction: the lock stops the catalog race between concurrent CREATE ... IF NOT EXISTS.
      await query(
        `DO $$ BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('${t}'));
  CREATE TABLE IF NOT EXISTS ${t} (
    id text PRIMARY KEY,
    event jsonb NOT NULL,
    attempts int NOT NULL DEFAULT 0,
    next_attempt_at bigint,
    last_error text
  );
  CREATE INDEX IF NOT EXISTS ${t}_due_idx ON ${t} (next_attempt_at) WHERE next_attempt_at IS NOT NULL;
END $$`,
        [],
      );
    },
    async add(e) {
      // ::text first so every driver sends the JSON as text; a driver that sees a jsonb parameter may encode the string again.
      await query(`INSERT INTO ${t} (${columns}) VALUES ($1, $2::text::jsonb, $3, $4, $5) ON CONFLICT (id) DO NOTHING`, [
        e.id,
        JSON.stringify(e.event),
        e.attempts,
        e.nextAttemptAt,
        e.lastError,
      ]);
    },
    async due(now, limit) {
      const { rows } = await query(`SELECT ${columns} FROM ${t} WHERE next_attempt_at <= $1 ORDER BY next_attempt_at, id LIMIT $2`, [now, limit]);
      return rows.map(fromRow);
    },
    async claim(now, leaseMs) {
      // The lease is next_attempt_at itself: committed in the future, it hides the row from other workers and brings it back if this one dies.
      const { rows } = await query(
        `WITH due AS (
  SELECT id FROM ${t} WHERE next_attempt_at <= $1 ORDER BY next_attempt_at, id LIMIT 1 FOR UPDATE SKIP LOCKED
)
UPDATE ${t} SET next_attempt_at = $2 FROM due WHERE ${t}.id = due.id
RETURNING ${t}.id, ${t}.event, ${t}.attempts, ${t}.next_attempt_at, ${t}.last_error`,
        [now, now + leaseMs],
      );
      return rows[0] ? fromRow(rows[0]) : null;
    },
    async markSent(id) {
      await query(`DELETE FROM ${t} WHERE id = $1`, [id]);
    },
    async markFailed(id, u) {
      await query(`UPDATE ${t} SET attempts = $2, next_attempt_at = $3, last_error = $4 WHERE id = $1`, [id, u.attempts, u.nextAttemptAt, u.lastError]);
    },
    async dead() {
      const { rows } = await query(`SELECT ${columns} FROM ${t} WHERE next_attempt_at IS NULL ORDER BY id`, []);
      return rows.map(fromRow);
    },
  };
}

/**
 * Type-checks a generic billing event and refuses `amountMinor`: the API
 * ignores unknown fields, so that payment would be recorded as 0 and earn nothing.
 */
export function buildBillingEvent(event: GenericBillingEvent & { amountMinor?: never }): GenericBillingEvent {
  if ('amountMinor' in event) throw new TypeError('buildBillingEvent: billing events use amountGross (integer minor units), not amountMinor');
  return event;
}

function toHex(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += b.toString(16).padStart(2, '0');
  return s;
}
