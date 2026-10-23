import { ListPromise, type ListEnvelope, type OperationInput, type QueryValue, type RequestOptions, type Transport } from './core.js';
import { ApiConnectionError, ApiError, ApiTimeoutError, ReferalliError } from './errors.js';
import { errorClasses } from './errors.generated.js';
import type * as T from './generated.js';
import { API_VERSION, buildResources, operations, type OperationId, type Resources } from './resources.generated.js';
import { SDK_VERSION } from './version.js';
import { webhooks, type Webhooks } from './webhooks.js';

/** Production API. */
export const DEFAULT_BASE_URL = 'https://referalli.com';

type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

export interface ReferalliOptions {
  /** Your secret `rk_` key. Defaults to the `REFERALLI_API_KEY` environment variable. Keep it on your server. */
  apiKey?: string;
  /** Default `https://referalli.com` (or `REFERALLI_BASE_URL`). */
  baseUrl?: string;
  /**
   * The `referalli-version` to send. Defaults to the version this SDK was
   * generated against; `null` sends none (your key's pinned version applies).
   */
  apiVersion?: string | null;
  /**
   * Sent as `referalli-mode`. Only needed for session auth; an API key's mode
   * is fixed, and a mismatching header is refused with `mode_mismatch`.
   */
  mode?: 'live' | 'test';
  /** Milliseconds per attempt. Default 60 000. */
  timeout?: number;
  /** Retries after the first attempt (network errors, timeouts, 408, 429, 5xx). Default 2. */
  maxRetries?: number;
  /** First backoff in milliseconds; doubles per retry, with jitter, up to 8 s. Default 500. */
  retryBaseDelay?: number;
  /** A custom fetch (tests, proxies, instrumentation). Defaults to the global fetch. */
  fetch?: FetchLike;
  /** Headers sent with every request. */
  headers?: Record<string, string>;
}

const RETRY_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const IDEMPOTENT = new Set(['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS']);
const MAX_BACKOFF_MS = 8_000;
const MAX_RETRY_AFTER_MS = 60_000;

/** One raw request. `kind` says how to read a success: JSON, text, or nothing. */
export interface RawRequest extends RequestOptions {
  method: string;
  path: string;
  query?: object;
  body?: unknown;
  kind?: 'json' | 'list' | 'text' | 'empty';
}

const env = (name: string): string | undefined => {
  try {
    return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
  } catch {
    return undefined;
  }
};

/**
 * The Referalli API client. Every operation is a typed method, grouped by
 * resource:
 *
 *   const referalli = new Referalli({ apiKey: process.env.REFERALLI_API_KEY });
 *   const link = await referalli.links.create({ programId, partnerId, destinationUrl });
 *   for await (const r of referalli.referrals.list({ status: 'active' })) console.log(r.id);
 *
 * POSTs carry an idempotency key (generated unless you pass one) that is
 * reused across retries. Idempotent and keyed requests are retried on network
 * errors, timeouts, 408, 429 and 5xx with exponential backoff and jitter,
 * honouring `Retry-After`. Errors are typed per code (`NotFoundError`, …).
 */
// The resource namespaces are assigned in the constructor; the interface declares them.
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging, @typescript-eslint/no-empty-object-type
export interface Referalli extends Resources {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Referalli {
  readonly baseUrl: string;
  readonly apiVersion: string | null;
  readonly mode: 'live' | 'test' | undefined;
  readonly timeout: number;
  readonly maxRetries: number;
  readonly retryBaseDelay: number;
  /** Webhook verification (`await referalli.webhooks.constructEvent(body, headers, secret)`). */
  readonly webhooks: Webhooks = webhooks;
  private readonly apiKey: string | undefined;
  private readonly fetchFn: FetchLike;
  private readonly headers: Record<string, string>;

  constructor(options: ReferalliOptions = {}) {
    this.apiKey = options.apiKey ?? env('REFERALLI_API_KEY');
    this.baseUrl = (options.baseUrl ?? env('REFERALLI_BASE_URL') ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.apiVersion = options.apiVersion === undefined ? API_VERSION : options.apiVersion;
    this.mode = options.mode;
    this.timeout = options.timeout ?? 60_000;
    this.maxRetries = Math.max(0, options.maxRetries ?? 2);
    this.retryBaseDelay = options.retryBaseDelay ?? 500;
    this.fetchFn = options.fetch ?? ((input, init) => globalThis.fetch(input, init));
    this.headers = { ...(options.headers ?? {}) };
    const transport: Transport = {
      op: (id, input, opts) => this.call(id as OperationId, input, opts) as Promise<never>,
      list: <Item, Page extends ListEnvelope<Item>>(id: string, input: OperationInput, opts?: RequestOptions) =>
        this.listPages<Item, Page>(id as OperationId, input, opts),
    };
    Object.assign(this, buildResources(transport));
  }

  /** Call any operation by its id (`postPartners`, `getReferralsId`, … see `operations`). */
  async call<R = unknown>(id: OperationId, input: OperationInput & { idempotencyKey?: string } = {}, options: RequestOptions = {}): Promise<R> {
    const spec = operations[id];
    if (!spec) throw new ReferalliError(`unknown operation ${String(id)}`);
    const path = spec.path.replace(/\{(\w+)\}/g, (_, name: string) => {
      const value = input.path?.[name];
      if (value === undefined || value === null || value === '') throw new ReferalliError(`${id}: missing path parameter "${name}"`);
      return encodeURIComponent(String(value));
    });
    return this.request<R>({
      ...options,
      idempotencyKey: options.idempotencyKey ?? input.idempotencyKey,
      method: spec.method,
      path,
      query: input.query,
      body: spec.body ? input.body : undefined,
      kind: spec.kind,
    });
  }

  /** Every item of a list operation, following `next_cursor`: `for await (const p of referalli.listAll('getPartners'))`. */
  listAll<Item = unknown>(id: OperationId, input: OperationInput = {}, options: RequestOptions = {}): ListPromise<Item, ListEnvelope<Item>> {
    return this.listPages<Item, ListEnvelope<Item>>(id, input, options);
  }

  private listPages<Item, Page extends ListEnvelope<Item>>(id: OperationId, input: OperationInput, options: RequestOptions = {}): ListPromise<Item, Page> {
    return new ListPromise<Item, Page>((cursor) =>
      this.call<Page>(id, cursor ? { ...input, query: { ...(input.query ?? {}), starting_after: cursor } } : input, options),
    );
  }

  /** A raw request to any path (`/v1/...`), with the client's auth, retries and error mapping. */
  async request<R = unknown>(req: RawRequest): Promise<R> {
    const method = req.method.toUpperCase();
    const url = this.baseUrl + req.path + encodeQuery(req.query);
    const version = req.apiVersion === undefined ? this.apiVersion : req.apiVersion;
    const headers: Record<string, string> = { accept: 'application/json', ...this.headers };
    if (version) headers['referalli-version'] = version;
    if (this.mode) headers['referalli-mode'] = this.mode;
    if (this.apiKey) headers.authorization = `Bearer ${this.apiKey}`;
    if (typeof (globalThis as { window?: unknown }).window === 'undefined') headers['user-agent'] = `referalli-js/${SDK_VERSION}`;
    const hasBody = req.body !== undefined;
    if (hasBody) headers['content-type'] = 'application/json';
    const key = req.idempotencyKey ?? (method === 'POST' ? await newIdempotencyKey() : undefined);
    if (key) headers['idempotency-key'] = key;
    Object.assign(headers, req.headers ?? {});
    const body = hasBody ? JSON.stringify(req.body) : undefined;
    const retryable = IDEMPOTENT.has(method) || Boolean(key);
    const maxRetries = retryable ? Math.max(0, req.maxRetries ?? this.maxRetries) : 0;
    const timeout = req.timeout ?? this.timeout;

    for (let attempt = 0; ; attempt++) {
      let res: Response;
      const { signal, cancel, timedOut } = withTimeout(timeout, req.signal);
      try {
        res = await this.fetchFn(url, { method, headers, body, signal });
      } catch (err) {
        cancel();
        if (req.signal?.aborted) throw req.signal.reason ?? err;
        if (attempt < maxRetries) {
          await sleep(this.backoff(attempt), req.signal);
          continue;
        }
        if (timedOut()) throw new ApiTimeoutError(`${method} ${req.path} timed out after ${timeout} ms`, { cause: err });
        throw new ApiConnectionError(`${method} ${req.path} failed: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
      }
      try {
        if (res.ok) {
          if (req.kind === 'text') return (await res.text()) as R;
          const raw = await res.text();
          if (req.kind === 'empty' || raw === '') return undefined as R;
          return JSON.parse(raw) as R;
        }
        const raw = await res.text().catch(() => '');
        const resHeaders = headerRecord(res.headers);
        const retryAfterMs = parseRetryAfter(resHeaders);
        if (RETRY_STATUSES.has(res.status) && attempt < maxRetries && resHeaders['x-should-retry'] !== 'false') {
          await sleep(retryAfterMs ?? this.backoff(attempt), req.signal);
          continue;
        }
        throw toApiError(res.status, raw, resHeaders, retryAfterMs);
      } catch (err) {
        if (err instanceof ReferalliError || req.signal?.aborted) throw err;
        if (timedOut()) {
          if (attempt < maxRetries) continue;
          throw new ApiTimeoutError(`${method} ${req.path} timed out after ${timeout} ms`, { cause: err });
        }
        throw new ApiConnectionError(`${method} ${req.path}: could not read the response`, { cause: err });
      } finally {
        cancel();
      }
    }
  }

  private backoff(attempt: number): number {
    const base = Math.min(this.retryBaseDelay * 2 ** attempt, MAX_BACKOFF_MS);
    return base * (0.75 + Math.random() * 0.25);
  }

  // --- Helpers kept from the hand-written SDK -----------------------------------------

  /** Attribute a new customer to the partner who referred them: the key server-side call at signup. */
  associate(body: T.PostReferralsAssociateBody, options?: RequestOptions): Promise<T.PostReferralsAssociateResponse> {
    return this.referrals.associate(body, { idempotencyKey: body.idempotencyKey, ...options });
  }

  /** Report a customer's product event (`activation` or a custom name) that can pay a bounty. */
  trackEvent(
    body: { programId: string; customerRef: string; event: string; occurredAt?: string; idempotencyKey?: string },
    options?: RequestOptions,
  ): Promise<T.PostTrackEventsResponse> {
    return this.track.events({ type: 'event', ...body }, { idempotencyKey: body.idempotencyKey, ...options });
  }

  /** Report value facts (payments, credit, costs). Up to 500 per call, each idempotent by `externalId`. */
  reportValueEvents(events: T.PostValueEventsBody['events'], options?: RequestOptions): Promise<T.PostValueEventsResponse> {
    return this.value.events({ events }, options);
  }

  /** A payment, with the cash received and any store credit or discount that paid part of it. */
  reportPayment(input: ValueFact, options?: RequestOptions): Promise<T.PostValueEventsResponse> {
    return this.reportValueEvents([{ ...input, kind: 'payment' } as ValueEvent], options);
  }
}

type ValueEvent = T.PostValueEventsBody['events'][number];
type ValueFact = Omit<ValueEvent, 'kind'>;

function encodeQuery(query: object | undefined): string {
  if (!query) return '';
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query as Record<string, QueryValue>)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) for (const x of v) qs.append(k, String(x));
    else qs.append(k, v instanceof Date ? v.toISOString() : String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}

function headerRecord(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => (out[k.toLowerCase()] = v));
  return out;
}

/** Milliseconds from `retry-after-ms` / `retry-after` (seconds or an HTTP date), capped at 60 s. */
function parseRetryAfter(h: Record<string, string>): number | null {
  const ms = Number(h['retry-after-ms']);
  if (h['retry-after-ms'] && Number.isFinite(ms)) return Math.min(Math.max(0, ms), MAX_RETRY_AFTER_MS);
  const v = h['retry-after'];
  if (!v) return null;
  const secs = Number(v);
  if (Number.isFinite(secs)) return Math.min(Math.max(0, secs * 1000), MAX_RETRY_AFTER_MS);
  const at = Date.parse(v);
  return Number.isNaN(at) ? null : Math.min(Math.max(0, at - Date.now()), MAX_RETRY_AFTER_MS);
}

function toApiError(status: number, raw: string, headers: Record<string, string>, retryAfterMs: number | null): ApiError {
  let err: { code?: unknown; message?: unknown; requestId?: unknown; docs_url?: unknown; details?: unknown } = {};
  try {
    const parsed = JSON.parse(raw) as { error?: typeof err };
    if (parsed && typeof parsed.error === 'object' && parsed.error) err = parsed.error;
  } catch {
    /* not JSON */
  }
  const code = typeof err.code === 'string' && err.code ? err.code : 'http_error';
  const Cls = errorClasses[code] ?? ApiError;
  return new Cls({
    status,
    code,
    message: typeof err.message === 'string' ? err.message : raw.slice(0, 500) || `HTTP ${status}`,
    requestId: (typeof err.requestId === 'string' ? err.requestId : undefined) ?? headers['x-request-id'] ?? null,
    docsUrl: typeof err.docs_url === 'string' ? err.docs_url : null,
    details: err.details,
    retryAfter: retryAfterMs === null ? null : retryAfterMs / 1000,
    headers,
  });
}

/** An AbortSignal that fires on `timeout` ms or when `parent` aborts (no `AbortSignal.any`: Node 18). */
function withTimeout(timeout: number, parent?: AbortSignal): { signal: AbortSignal; cancel: () => void; timedOut: () => boolean } {
  const controller = new AbortController();
  let fired = false;
  const timer = timeout > 0 && Number.isFinite(timeout) ? setTimeout(() => ((fired = true), controller.abort()), timeout) : undefined;
  const onAbort = () => controller.abort(parent?.reason);
  if (parent) {
    if (parent.aborted) controller.abort(parent.reason);
    else parent.addEventListener('abort', onAbort, { once: true });
  }
  return {
    signal: controller.signal,
    cancel: () => {
      if (timer) clearTimeout(timer);
      parent?.removeEventListener('abort', onAbort);
    },
    timedOut: () => fired,
  };
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const t = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(signal?.reason);
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

async function newIdempotencyKey(): Promise<string> {
  const c = (globalThis as { crypto?: { randomUUID?: () => string; getRandomValues?: (a: Uint8Array) => Uint8Array } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  let bytes = new Uint8Array(16);
  if (c?.getRandomValues) c.getRandomValues(bytes);
  else {
    const mod = 'node:crypto';
    const nodeCrypto = (await import(/* webpackIgnore: true */ /* @vite-ignore */ mod)) as { randomBytes(n: number): Uint8Array };
    bytes = new Uint8Array(nodeCrypto.randomBytes(16));
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
