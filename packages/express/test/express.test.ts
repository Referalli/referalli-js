import { createHmac } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { attributeSignup, referalliAttribution, referalliWebhook } from '../src/index.js';

const secret = `whsec_${Buffer.from('e'.repeat(24)).toString('base64')}`;
const body = JSON.stringify({ id: 'evt_1', topic: 'commission.earned', orgId: 'org_1', createdAt: '2026-10-21T00:00:00Z', data: { amountMinor: 500 } });
const sign = (raw: string, ts = Math.floor(Date.now() / 1000)) => ({
  'content-type': 'application/json',
  'webhook-id': 'whd_1',
  'webhook-timestamp': String(ts),
  'webhook-signature': `v1,${createHmac('sha256', Buffer.from(secret.slice(6), 'base64')).update(`whd_1.${ts}.${raw}`).digest('base64')}`,
});

let base = '';
let close: () => void;
const seen: unknown[] = [];
const associate = vi.fn(async () => ({ referral: { id: 'ref_1' } }));

beforeAll(async () => {
  const app = express();
  // Webhook routes: unparsed stream, express.raw(), or after express.json() (an error).
  app.post('/hooks/stream', referalliWebhook({ secret }), (req, res) => {
    seen.push(req.referalliEvent);
    res.json({ received: true });
  });
  app.post('/hooks/raw', express.raw({ type: 'application/json' }), referalliWebhook({ secret }), (req, res) => {
    res.json({ topic: req.referalliEvent!.topic });
  });
  app.post('/hooks/parsed', express.json(), referalliWebhook({ secret }), (_req, res) => res.json({}));
  app.use(referalliAttribution({ secure: false }));
  app.get('/page', (req, res) => res.json({ referral: req.referral ?? null }));
  app.post('/signup', async (req, res) => {
    res.json({ out: await attributeSignup(req, { client: { associate }, programId: 'prg_1', customerRef: 'usr_1' }) });
  });
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => res.status(500).json({ error: err.message }));
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  close = () => server.close();
});
afterAll(() => close());

describe('referalliWebhook', () => {
  it('verifies the raw stream and exposes the typed event', async () => {
    const res = await fetch(`${base}/hooks/stream`, { method: 'POST', body, headers: sign(body) });
    expect(res.status).toBe(200);
    expect(seen.at(-1)).toMatchObject({ topic: 'commission.earned', data: { amountMinor: 500 } });
  });

  it('works after express.raw()', async () => {
    const res = await fetch(`${base}/hooks/raw`, { method: 'POST', body, headers: sign(body) });
    expect(await res.json()).toEqual({ topic: 'commission.earned' });
  });

  it('answers 400 with a reason on a bad signature or stale timestamp', async () => {
    const bad = await fetch(`${base}/hooks/stream`, { method: 'POST', body: body.replace('500', '900'), headers: sign(body) });
    expect(bad.status).toBe(400);
    expect(await bad.json()).toMatchObject({ reason: 'signature' });
    const stale = await fetch(`${base}/hooks/stream`, { method: 'POST', body, headers: sign(body, Math.floor(Date.now() / 1000) - 3600) });
    expect(await stale.json()).toMatchObject({ reason: 'timestamp' });
  });

  it('explains when the body was already parsed', async () => {
    const res = await fetch(`${base}/hooks/parsed`, { method: 'POST', body, headers: sign(body) });
    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/before express\.json\(\)/);
  });
});

describe('referalliAttribution', () => {
  it('sets the first-party cookie from ?via= and exposes req.referral', async () => {
    const res = await fetch(`${base}/page?via=DANA`);
    const setCookie = res.headers.get('set-cookie')!;
    expect(setCookie).toMatch(/^referalli_ctx=/);
    expect(setCookie).toContain('SameSite=Lax');
    expect(setCookie).not.toContain('HttpOnly');
    const { referral } = (await res.json()) as { referral: { code: string; anonId: string } };
    expect(referral.code).toBe('DANA');

    const cookie = setCookie.split(';')[0]!;
    const later = (await (await fetch(`${base}/page`, { headers: { cookie } })).json()) as { referral: { anonId: string } };
    expect(later.referral.anonId).toBe(referral.anonId);

    const signup = (await (await fetch(`${base}/signup`, { method: 'POST', headers: { cookie } })).json()) as { out: unknown };
    expect(signup.out).toEqual({ referral: { id: 'ref_1' } });
    expect(associate).toHaveBeenCalledWith(expect.objectContaining({ anonId: referral.anonId, couponCode: 'DANA', idempotencyKey: 'signup:usr_1' }));
  });

  it('gives req.referral = null without a referral', async () => {
    const res = await fetch(`${base}/page`);
    expect(res.headers.get('set-cookie')).toBeNull();
    expect(await res.json()).toEqual({ referral: null });
  });
});

describe('referalliAttribution: legacy twin and consent (REF-H18, REF-P01)', () => {
  const run = (url: string, opts: Parameters<typeof referalliAttribution>[0], cookie?: string) => {
    const headers: Record<string, unknown> = {};
    const res = { getHeader: (n: string) => headers[n], setHeader: (n: string, v: unknown) => void (headers[n] = v) };
    const req = { url, headers: cookie ? { cookie } : {} } as unknown as Parameters<ReturnType<typeof referalliAttribution>>[0];
    referalliAttribution(opts)(req, res as never, () => {});
    return { referral: req.referral, cookies: (headers['set-cookie'] as string[] | undefined) ?? [] };
  };

  it('writes referalli_ctx and the referally_ctx twin with the same value and attributes', () => {
    const { cookies } = run('/?via=DANA', { secure: true });
    expect(cookies.map((c) => c.split('=')[0])).toEqual(['referalli_ctx', 'referally_ctx']);
    expect(cookies[0]!.slice('referalli_ctx'.length)).toBe(cookies[1]!.slice('referally_ctx'.length));
  });

  it('unknown consent: no cookie, but req.referral carries the URL referral', () => {
    const { cookies, referral } = run('/?via=DANA', { consent: () => 'unknown' });
    expect(cookies).toEqual([]);
    expect(referral).toMatchObject({ code: 'DANA' });
  });

  it('denied consent deletes both names and drops the referral', () => {
    const stored = encodeURIComponent(JSON.stringify({ anonId: 'a_1', code: 'OLD', clickId: null, ts: 1 }));
    const { cookies, referral } = run('/?via=DANA', { consent: () => 'denied' }, `referalli_ctx=${stored}`);
    expect(cookies.map((c) => c.split(';')[0])).toEqual(['referalli_ctx=', 'referally_ctx=']);
    expect(cookies[0]).toContain('Max-Age=0');
    expect(referral).toBeNull();
  });
});
