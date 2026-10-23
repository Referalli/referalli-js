import { describe, expect, it } from 'vitest';
import {
  API_VERSION,
  ApiConnectionError,
  ApiError,
  ApiTimeoutError,
  NotFoundError,
  RateLimitedError,
  Referalli,
  ReferalliError,
  ValidationError,
} from '../src/index.js';

interface Seen {
  method: string;
  url: URL;
  headers: Record<string, string>;
  body: string | undefined;
}

type Reply = Response | ((init: RequestInit) => Promise<Response>) | Error;

/** A mock fetch answering `replies` in order and recording every request. */
function mockFetch(replies: Reply[]) {
  const seen: Seen[] = [];
  const fetch = async (input: string, init: RequestInit): Promise<Response> => {
    seen.push({ method: String(init.method), url: new URL(input), headers: init.headers as Record<string, string>, body: init.body as string | undefined });
    const next = replies.shift();
    if (!next) throw new Error('no reply queued');
    if (next instanceof Error) throw next;
    if (typeof next === 'function') return next(init);
    return next;
  };
  return { fetch, seen };
}

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });
const apiErr = (status: number, code: string, headers: Record<string, string> = {}) =>
  json(status, { error: { code, message: `${code}!`, requestId: `req_${code}`, docs_url: `https://referalli.com/docs/errors-and-limits#${code}` } }, headers);
const partner = { id: 'ptr_1', email: 'a@example.com', displayName: 'A', externalRef: null, status: 'active', tags: [], notes: null, createdAt: '2026-10-21T12:00:00.000Z' };
const client = (replies: Reply[], opts: ConstructorParameters<typeof Referalli>[0] = {}) => {
  const m = mockFetch(replies);
  return { ...m, referalli: new Referalli({ apiKey: 'rk_test_x', fetch: m.fetch, retryBaseDelay: 1, ...opts }) };
};

describe('Referalli client', () => {
  it('defaults to the production API and sends auth, version and a JSON body', async () => {
    const { referalli, seen } = client([json(200, partner)]);
    expect(referalli.baseUrl).toBe('https://referalli.com');
    await referalli.partners.create({ email: 'a@example.com', displayName: 'A' });
    const r = seen[0]!;
    expect(r.method).toBe('POST');
    expect(r.url.href).toBe('https://referalli.com/v1/partners');
    expect(r.headers.authorization).toBe('Bearer rk_test_x');
    expect(r.headers['referalli-version']).toBe(API_VERSION);
    expect(r.headers['content-type']).toBe('application/json');
    expect(r.headers['idempotency-key']).toMatch(/^[0-9a-f-]{36}$/);
    expect(JSON.parse(r.body!)).toEqual({ email: 'a@example.com', displayName: 'A' });
  });

  it('sends referalli-mode when a mode is set', async () => {
    const { referalli, seen } = client([json(200, partner)], { mode: 'test' });
    await referalli.partners.retrieve('ptr_1');
    expect(seen[0]!.headers['referalli-mode']).toBe('test');
  });

  it('percent-encodes path params and sends no body or idempotency key on GET', async () => {
    const { referalli, seen } = client([json(200, partner)]);
    await referalli.partners.retrieve('ptr 1/x');
    expect(seen[0]!.url.pathname).toBe('/v1/partners/ptr%201%2Fx');
    expect(seen[0]!.body).toBeUndefined();
    expect(seen[0]!.headers['idempotency-key']).toBeUndefined();
  });

  it('encodes query params and drops unset ones', async () => {
    const { referalli, seen } = client([json(200, { object: 'list', data: [], has_more: false, next_cursor: null })]);
    await referalli.partners.list({ email: 'a+b@example.com', status: 'active', limit: 2, starting_after: undefined });
    expect(Object.fromEntries(seen[0]!.url.searchParams)).toEqual({ email: 'a+b@example.com', status: 'active', limit: '2' });
  });

  it('retries a 429 after Retry-After, reusing the idempotency key', async () => {
    const { referalli, seen } = client([apiErr(429, 'rate_limited', { 'retry-after': '0' }), json(200, partner)]);
    await expect(referalli.partners.create({ email: 'a@example.com' })).resolves.toMatchObject({ id: 'ptr_1' });
    expect(seen).toHaveLength(2);
    expect(seen[0]!.headers['idempotency-key']).toBe(seen[1]!.headers['idempotency-key']);
  });

  it('honours Retry-After as the wait before the retry', async () => {
    const { referalli, seen } = client([apiErr(503, 'internal_error', { 'retry-after-ms': '120' }), json(200, partner)]);
    const t0 = Date.now();
    await referalli.partners.retrieve('ptr_1');
    expect(seen).toHaveLength(2);
    expect(Date.now() - t0).toBeGreaterThanOrEqual(110);
  });

  it('retries 5xx and network errors with backoff, then gives up with the last error', async () => {
    const { referalli, seen } = client([apiErr(503, 'internal_error'), new TypeError('fetch failed'), json(200, partner)]);
    await expect(referalli.partners.retrieve('ptr_1')).resolves.toMatchObject({ id: 'ptr_1' });
    expect(seen).toHaveLength(3);

    const down = client([new TypeError('fetch failed'), new TypeError('fetch failed'), new TypeError('fetch failed')]);
    await expect(down.referalli.partners.retrieve('ptr_1')).rejects.toBeInstanceOf(ApiConnectionError);
    expect(down.seen).toHaveLength(3);
  });

  it('stops after maxRetries and raises the typed error with retryAfter', async () => {
    const replies = [0, 1, 2].map(() => apiErr(429, 'rate_limited', { 'retry-after': '0' }));
    const { referalli, seen } = client(replies);
    const err = await referalli.partners.retrieve('ptr_1').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(RateLimitedError);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 429, code: 'rate_limited', retryAfter: 0, requestId: 'req_rate_limited', name: 'RateLimitedError' });
    expect(seen).toHaveLength(3);
  });

  it('does not retry a PATCH without an idempotency key, but does with one', async () => {
    const once = client([apiErr(503, 'internal_error'), json(200, partner)]);
    await expect(once.referalli.partners.update('ptr_1', { displayName: 'B' })).rejects.toBeInstanceOf(ApiError);
    expect(once.seen).toHaveLength(1);

    const keyed = client([apiErr(503, 'internal_error'), json(200, partner)]);
    await keyed.referalli.partners.update('ptr_1', { displayName: 'B' }, { idempotencyKey: 'upd_1' });
    expect(keyed.seen.map((s) => s.headers['idempotency-key'])).toEqual(['upd_1', 'upd_1']);
  });

  it('maps error codes to classes and never retries a 4xx', async () => {
    const { referalli, seen } = client([apiErr(400, 'validation_error'), apiErr(404, 'not_found'), json(418, { error: { code: 'teapot', message: 'short' } })]);
    await expect(referalli.partners.create({ email: 'x' })).rejects.toBeInstanceOf(ValidationError);
    const nf = await referalli.partners.retrieve('nope').catch((e: unknown) => e);
    expect(nf).toBeInstanceOf(NotFoundError);
    expect(nf).toMatchObject({ docsUrl: 'https://referalli.com/docs/errors-and-limits#not_found', requestId: 'req_not_found' });
    const tea = await referalli.partners.retrieve('t').catch((e: unknown) => e);
    expect(tea).toBeInstanceOf(ApiError);
    expect((tea as ApiError).constructor).toBe(ApiError);
    expect(seen).toHaveLength(3);
  });

  it('times out each attempt, retries, then raises ApiTimeoutError', async () => {
    const hang = (init: RequestInit) =>
      new Promise<Response>((_, reject) => init.signal!.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
    const { referalli, seen } = client([hang, hang], { timeout: 20, maxRetries: 1 });
    const err = await referalli.partners.retrieve('ptr_1').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiTimeoutError);
    expect(seen).toHaveLength(2);
  });

  it('a caller abort is not retried', async () => {
    const ac = new AbortController();
    const hang = (init: RequestInit) =>
      new Promise<Response>((_, reject) => init.signal!.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
    const { referalli, seen } = client([hang, hang]);
    const p = referalli.partners.retrieve('ptr_1', { signal: ac.signal });
    setTimeout(() => ac.abort(new Error('stop')), 5);
    await expect(p).rejects.toThrow('stop');
    expect(seen).toHaveLength(1);
  });

  it('returns text responses as strings', async () => {
    const { referalli } = client([new Response('Date,Amount\n', { status: 200, headers: { 'content-type': 'text/csv' } })]);
    await expect(referalli.export.accounting({ year: 2026, format: 'xero' })).resolves.toBe('Date,Amount\n');
  });

  it('can call any operation by id', async () => {
    const { referalli, seen } = client([json(200, partner)]);
    await referalli.call('getPartnersId', { path: { id: 'ptr_1' } });
    expect(seen[0]!.url.pathname).toBe('/v1/partners/ptr_1');
    await expect(referalli.call('getPartnersId', {})).rejects.toBeInstanceOf(ReferalliError);
  });
});

describe('auto-paging', () => {
  const pages = [
    { object: 'list', data: [{ id: 'a' }, { id: 'b' }], has_more: true, next_cursor: 'b' },
    { object: 'list', data: [{ id: 'c' }], has_more: true, next_cursor: 'c' },
    { object: 'list', data: [{ id: 'd' }], has_more: false, next_cursor: null },
  ];

  it('await gives the first page; for await walks every item', async () => {
    const { referalli, seen } = client(pages.map((p) => json(200, p)));
    const first = await referalli.referrals.list({ limit: 2 });
    expect(first.data.map((r) => r.id)).toEqual(['a', 'b']);
    expect(seen).toHaveLength(1);

    const all = client(pages.map((p) => json(200, p)));
    const ids: string[] = [];
    // Filters ride along on every page (any query works through listAll).
    for await (const r of all.referalli.listAll<{ id: string }>('getReferrals', { query: { limit: 2, status: 'active' } })) ids.push(r.id);
    expect(ids).toEqual(['a', 'b', 'c', 'd']);
    expect(all.seen.map((s) => s.url.searchParams.get('starting_after'))).toEqual([null, 'b', 'c']);
    expect(all.seen.every((s) => s.url.searchParams.get('status') === 'active' && s.url.searchParams.get('limit') === '2')).toBe(true);
  });

  it('toArray stops at the limit without fetching further pages', async () => {
    const { referalli, seen } = client(pages.map((p) => json(200, p)));
    expect((await referalli.referrals.list().toArray({ limit: 2 })).map((r) => r.id)).toEqual(['a', 'b']);
    expect(seen).toHaveLength(1);
  });

  it('listAll pages by operation id', async () => {
    const { referalli } = client(pages.map((p) => json(200, p)));
    expect((await referalli.listAll<{ id: string }>('getReferrals').toArray()).map((r) => r.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('nothing is requested until awaited or iterated', async () => {
    const { referalli, seen } = client([json(200, pages[2])]);
    const lazy = referalli.referrals.list();
    expect(seen).toHaveLength(0);
    await lazy;
    expect(seen).toHaveLength(1);
  });

  it('explains a non-list response (legacy API version)', async () => {
    const { referalli } = client([json(200, [{ id: 'a' }])], { apiVersion: null });
    await expect(referalli.referrals.list()).rejects.toThrow(/list page/);
  });
});

describe('helpers', () => {
  it('associate sends the idempotency key in body and header', async () => {
    const { referalli, seen } = client([json(200, { referral: null })]);
    await referalli.associate({ programId: 'prg_1', customerRef: 'cus_1', anonId: 'a_1', idempotencyKey: 'signup:1' });
    expect(seen[0]!.url.pathname).toBe('/v1/referrals/associate');
    expect(seen[0]!.headers['idempotency-key']).toBe('signup:1');
  });

  it('trackEvent posts a product event', async () => {
    const { referalli, seen } = client([json(200, { ok: true })]);
    await referalli.trackEvent({ programId: 'prg_1', customerRef: 'cus_1', event: 'activation' });
    expect(JSON.parse(seen[0]!.body!)).toEqual({ type: 'event', programId: 'prg_1', customerRef: 'cus_1', event: 'activation' });
  });

  it('reportPayment posts one value event', async () => {
    const { referalli, seen } = client([json(200, { results: [], errors: [] })]);
    await referalli.reportPayment({ customerRef: 'cus_1', currency: 'usd', cashMinor: 900, externalId: 'in_1', occurredAt: '2026-10-01' });
    expect(JSON.parse(seen[0]!.body!)).toEqual({ events: [{ kind: 'payment', customerRef: 'cus_1', currency: 'usd', cashMinor: 900, externalId: 'in_1', occurredAt: '2026-10-01' }] });
  });
});
