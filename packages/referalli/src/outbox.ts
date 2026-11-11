import { DEFAULT_BASE_URL, Referalli } from './client.js';
import { hmacSha256 } from './sha256.js';

// The server's rough rates for its payment limit, kept in step with the server's table by a monorepo test.
export const APPROX_USD_PER_UNIT: Record<string, number> = { aed: 0.27, afn: 0.014, all: 0.011, amd: 0.0026, ang: 0.56, aoa: 0.0011, ars: 0.001, aud: 0.65, awg: 0.56, azn: 0.59, bam: 0.56, bbd: 0.5, bdt: 0.0082, bgn: 0.56, bhd: 2.65, bif: 0.00034, bmd: 1, bnd: 0.77, bob: 0.145, brl: 0.18, bsd: 1, btn: 0.012, bwp: 0.074, byn: 0.31, bzd: 0.5, cad: 0.72, cdf: 0.00035, chf: 1.15, clp: 0.00105, cny: 0.14, cop: 0.00025, crc: 0.002, cuc: 1, cup: 0.042, cve: 0.01, czk: 0.044, djf: 0.0056, dkk: 0.15, dop: 0.016, dzd: 0.0075, egp: 0.02, ern: 0.067, etb: 0.0071, eur: 1.1, fjd: 0.44, fkp: 1.3, gbp: 1.3, gel: 0.37, ghs: 0.065, gip: 1.3, gmd: 0.014, gnf: 0.000116, gtq: 0.13, gyd: 0.0048, hkd: 0.13, hnl: 0.038, hrk: 0.146, htg: 0.0076, huf: 0.0027, idr: 0.000063, ils: 0.28, inr: 0.012, iqd: 0.00076, irr: 0.000024, isk: 0.0072, jmd: 0.0063, jod: 1.41, jpy: 0.0066, kes: 0.0077, kgs: 0.0114, khr: 0.00025, kmf: 0.0023, kpw: 0.0011, krw: 0.00072, kwd: 3.26, kyd: 1.2, kzt: 0.002, lak: 0.000046, lbp: 0.000011, lkr: 0.0033, lrd: 0.0055, lsl: 0.055, lyd: 0.18, mad: 0.1, mdl: 0.057, mga: 0.00022, mkd: 0.018, mmk: 0.00048, mnt: 0.00029, mop: 0.125, mru: 0.025, mur: 0.022, mvr: 0.065, mwk: 0.00058, mxn: 0.054, myr: 0.23, mzn: 0.0156, nad: 0.055, ngn: 0.00065, nio: 0.027, nok: 0.095, npr: 0.0074, nzd: 0.6, omr: 2.6, pab: 1, pen: 0.27, pgk: 0.25, php: 0.017, pkr: 0.0036, pln: 0.26, pyg: 0.000125, qar: 0.27, ron: 0.22, rsd: 0.0093, rub: 0.012, rwf: 0.00072, sar: 0.27, sbd: 0.12, scr: 0.07, sdg: 0.0017, sek: 0.1, sgd: 0.77, shp: 1.3, sle: 0.044, sll: 0.000044, sos: 0.00175, srd: 0.027, ssp: 0.00022, stn: 0.045, svc: 0.114, syp: 0.000077, szl: 0.055, thb: 0.029, tjs: 0.094, tmt: 0.29, tnd: 0.33, top: 0.42, try: 0.029, ttd: 0.147, twd: 0.031, tzs: 0.00037, uah: 0.024, ugx: 0.00027, usd: 1, uyu: 0.025, uzs: 0.00008, ves: 0.005, vnd: 0.00004, vuv: 0.0083, wst: 0.36, xaf: 0.0017, xcd: 0.37, xcg: 0.56, xdr: 1.35, xof: 0.0017, xpf: 0.0094, xsu: 1.25, yer: 0.004, zar: 0.055, zmw: 0.04, zwg: 0.037, zwl: 0.0031 };
const ZERO = new Set(['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf']);
const THREE = new Set(['bhd', 'iqd', 'jod', 'kwd', 'lyd', 'omr', 'tnd']);
const approxUsdMinor = (minor: number, currency: string) => {
  const c = currency.toLowerCase();
  return Math.round((minor / 10 ** (ZERO.has(c) ? 0 : THREE.has(c) ? 3 : 2)) * (APPROX_USD_PER_UNIT[c] ?? 1) * 100);
};

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
  if ((e.amountGross ?? 0) < 0) throw refuse('amountGross must not be negative: send a refund to reverse a payment');
  if (e.currency !== undefined && !Intl.supportedValuesOf('currency').includes(e.currency.toUpperCase())) {
    throw refuse('currency must be an ISO 4217 code such as usd');
  }
  // shortcut: the server's default limit, since a connection's own isn't known here; it warns rather than refuses because the server holds these for release.
  if ((e.type ?? 'invoice_paid') === 'invoice_paid' && approxUsdMinor(e.amountGross ?? 0, e.currency ?? 'usd') > 1_000_000_000) console.warn(`createOutbox: event ${e.providerEventId}: amountGross ${e.amountGross} is over the default limit ($10M), so Referalli will hold it for release`);
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
 * a queued payment survives restarts: `pgOutboxStore` (Postgres) and
 * `sqliteOutboxStore` (SQLite, libSQL/Turso) implement it; any other store
 * needs these four methods (and `claim` for several workers).
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
 * Runs one SQL statement with `?` placeholders and answers its rows (none for a
 * statement that returns none). Shaped so libSQL's `client.execute` fits as it is.
 */
export type SqlExecute = (sql: string, params: unknown[]) => Promise<{ rows: unknown[] }>;

const fromSqliteRow = (r: any): OutboxEntry => ({
  id: String(r.id),
  event: typeof r.event === 'string' ? JSON.parse(r.event) : r.event,
  attempts: Number(r.attempts),
  nextAttemptAt: r.next_attempt_at === null || r.next_attempt_at === undefined ? null : Number(r.next_attempt_at),
  lastError: r.last_error ?? null,
});

/**
 * An `OutboxStore` on a SQLite or libSQL (Turso) table, through your own
 * `execute` function, so the SDK adds no driver:
 *
 *   // libSQL / Turso
 *   const store = sqliteOutboxStore({ execute: (sql, args) => client.execute({ sql, args: args as InArgs }), table: 'referalli_outbox' });
 *   // better-sqlite3 (synchronous)
 *   const store = sqliteOutboxStore({ execute: async (sql, p) => { const st = db.prepare(sql); return { rows: st.reader ? st.all(p) : (st.run(p), []) }; }, table: 'referalli_outbox' });
 *   await store.migrate();
 *
 * Columns: `id` TEXT primary key (the providerEventId), `event` TEXT (JSON),
 * `attempts` INTEGER, `next_attempt_at` INTEGER (epoch ms; NULL = dead),
 * `last_error` TEXT. A sent row is deleted. `claim` is one `UPDATE … RETURNING`
 * statement (SQLite 3.35+), atomic because SQLite runs one writer at a time, so
 * several processes on the same database each get a different row.
 */
export function sqliteOutboxStore(options: { execute: SqlExecute; table: string }): OutboxStore & {
  claim(now: number, leaseMs: number): Promise<OutboxEntry | null>;
  /** Create the table and its index if missing. */
  migrate(): Promise<void>;
  /** Entries that hit the attempt cap. */
  dead(): Promise<OutboxEntry[]>;
} {
  const { execute, table: t } = options;
  // It goes into the SQL text, so nothing but a plain identifier gets through.
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(t)) throw new TypeError(`sqliteOutboxStore: table must be a plain identifier, got ${JSON.stringify(t)}`);
  const columns = 'id, event, attempts, next_attempt_at, last_error';
  const rows = async (sql: string, params: unknown[]) => (await execute(sql, params)).rows.map(fromSqliteRow);
  return {
    async migrate() {
      await execute(
        `CREATE TABLE IF NOT EXISTS ${t} (id TEXT PRIMARY KEY, event TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at INTEGER, last_error TEXT)`,
        [],
      );
      await execute(`CREATE INDEX IF NOT EXISTS ${t}_due_idx ON ${t} (next_attempt_at) WHERE next_attempt_at IS NOT NULL`, []);
    },
    async add(e) {
      await execute(`INSERT OR IGNORE INTO ${t} (${columns}) VALUES (?, ?, ?, ?, ?)`, [e.id, JSON.stringify(e.event), e.attempts, e.nextAttemptAt, e.lastError]);
    },
    async due(now, limit) {
      return rows(`SELECT ${columns} FROM ${t} WHERE next_attempt_at <= ? ORDER BY next_attempt_at, id LIMIT ?`, [now, limit]);
    },
    async claim(now, leaseMs) {
      // The lease is next_attempt_at itself: set in the future, it hides the row from other workers and brings it back if this one dies.
      const [entry] = await rows(
        `UPDATE ${t} SET next_attempt_at = ? WHERE id = (SELECT id FROM ${t} WHERE next_attempt_at <= ? ORDER BY next_attempt_at, id LIMIT 1) RETURNING ${columns}`,
        [now + leaseMs, now],
      );
      return entry ?? null;
    },
    async markSent(id) {
      await execute(`DELETE FROM ${t} WHERE id = ?`, [id]);
    },
    async markFailed(id, u) {
      await execute(`UPDATE ${t} SET attempts = ?, next_attempt_at = ?, last_error = ? WHERE id = ?`, [u.attempts, u.nextAttemptAt, u.lastError, id]);
    },
    async dead() {
      return rows(`SELECT ${columns} FROM ${t} WHERE next_attempt_at IS NULL ORDER BY id`, []);
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
