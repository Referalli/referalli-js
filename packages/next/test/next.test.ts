import { createHash, createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server.js';
import { describe, expect, it, vi } from 'vitest';

const cookieJar = new Map<string, string>();
vi.mock('next/headers.js', () => ({
  cookies: async () => ({ get: (name: string) => (cookieJar.has(name) ? { name, value: cookieJar.get(name)! } : undefined) }),
}));

const { attributeSignup, createWebhookHandler, getReferral, getReferralFromRequest, verifyWebhook } = await import('../src/index.js');
const { captureReferral, referalliMiddleware } = await import('../src/middleware.js');

const cookieValue = (res: Response) => {
  const raw = res.headers.get('set-cookie') ?? '';
  const m = raw.match(/referalli_ctx=([^;]+)/);
  return m ? (JSON.parse(decodeURIComponent(m[1]!)) as Record<string, unknown>) : null;
};

describe('middleware', () => {
  it('captures ?via= into a first-party cookie', () => {
    const res = referalliMiddleware(new NextRequest('https://shop.example/pricing?via=DANA'));
    const raw = res.headers.get('set-cookie')!;
    expect(raw).toContain('Path=/');
    expect(raw).toContain('SameSite=Lax');
    expect(raw).toContain('Secure');
    expect(raw).not.toContain('HttpOnly');
    expect(cookieValue(res)).toMatchObject({ code: 'DANA', clickId: null });
    expect(String(cookieValue(res)!.anonId)).toMatch(/^a_[a-z0-9]{20}$/);
  });

  it('leaves requests without a referral alone and keeps the anon id across referrals', () => {
    expect(referalliMiddleware(new NextRequest('https://shop.example/')).headers.get('set-cookie')).toBeNull();
    const first = cookieValue(referalliMiddleware(new NextRequest('https://shop.example/?ref=DANA')))!;
    const req = new NextRequest('https://shop.example/?ref_click_id=clk_9', {
      headers: { cookie: `referalli_ctx=${encodeURIComponent(JSON.stringify(first))}` },
    });
    const next = cookieValue(referalliMiddleware({ cookieDomain: '.shop.example' })(req))!;
    expect(next).toMatchObject({ anonId: first.anonId, code: 'DANA', clickId: 'clk_9' });
  });

  it('first touch keeps the original referral', () => {
    const first = cookieValue(referalliMiddleware(new NextRequest('https://shop.example/?via=DANA')))!;
    const req = new NextRequest('https://shop.example/?via=KAI', { headers: { cookie: `referalli_ctx=${encodeURIComponent(JSON.stringify(first))}` } });
    expect(cookieValue(captureReferral(req, NextResponse.next(), { firstTouch: true }))).toMatchObject({ code: 'DANA' });
  });

  it('records the visit server-side when given a publishable key', async () => {
    const fetchFn = vi.fn(async () => new Response('{}'));
    const waits: Promise<unknown>[] = [];
    captureReferral(
      new NextRequest('https://shop.example/?via=DANA', { headers: { 'user-agent': 'UA/1' } }),
      NextResponse.next(),
      { publishableKey: 'tok_1', fetch: fetchFn as unknown as typeof fetch },
      { waitUntil: (p) => void waits.push(p) },
    );
    await Promise.all(waits);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://referalli.com/t/tok_1/visit');
    expect(JSON.parse(String(init.body))).toMatchObject({ code: 'DANA', url: 'https://shop.example/?via=DANA' });
    expect((init.headers as Record<string, string>)['user-agent']).toBe('UA/1');
  });
});

describe('getReferral', () => {
  it('reads the cookie in server code and from a Request', async () => {
    const ctx = { anonId: 'a_1', code: 'DANA', clickId: null, ts: 1, exp: Date.now() + 60_000 };
    cookieJar.set('referalli_ctx', encodeURIComponent(JSON.stringify(ctx)));
    expect(await getReferral()).toEqual({ anonId: 'a_1', code: 'DANA', clickId: null, ts: 1 });
    const req = new Request('https://x', { headers: { cookie: `a=1; referalli_ctx=${encodeURIComponent(JSON.stringify(ctx))}` } });
    expect(getReferralFromRequest(req)).toMatchObject({ code: 'DANA' });
    cookieJar.clear();
    expect(await getReferral()).toBeNull();
  });
});

describe('attributeSignup (server action)', () => {
  it('associates the customer with the cookie referral and a hashed email', async () => {
    cookieJar.set('referalli_ctx', JSON.stringify({ anonId: 'a_1', code: 'DANA', clickId: 'clk_1', ts: 1 }));
    const associate = vi.fn(async () => ({ referral: { id: 'ref_1' } }));
    const out = await attributeSignup({ client: { associate }, programId: 'prg_1', customerRef: 'usr_1', email: 'Dana@Example.com' });
    expect(out).toEqual({ referral: { id: 'ref_1' } });
    expect(associate).toHaveBeenCalledWith({
      programId: 'prg_1',
      customerRef: 'usr_1',
      anonId: 'a_1',
      referralToken: 'clk_1',
      couponCode: 'DANA',
      emailHash: createHash('sha256').update('dana@example.com').digest('hex'),
      idempotencyKey: 'signup:usr_1',
    });
    cookieJar.clear();
  });

  it('never throws', async () => {
    const associate = vi.fn(async () => {
      throw new Error('down');
    });
    await expect(attributeSignup({ client: { associate }, programId: 'prg_1', customerRef: 'u', referral: { anonId: 'a', code: null, clickId: null, ts: 1 } })).resolves.toBeNull();
  });
});

describe('webhooks', () => {
  const secret = `whsec_${Buffer.from('n'.repeat(24)).toString('base64')}`;
  const sign = (body: string, ts = Math.floor(Date.now() / 1000)) => ({
    'webhook-id': 'whd_1',
    'webhook-timestamp': String(ts),
    'webhook-signature': `v1,${createHmac('sha256', Buffer.from(secret.slice(6), 'base64')).update(`whd_1.${ts}.${body}`).digest('base64')}`,
  });
  const body = JSON.stringify({ id: 'evt_1', topic: 'referral.created', orgId: 'org_1', createdAt: '2026-10-21T00:00:00Z', data: { referralId: 'ref_1' } });

  it('verifyWebhook(req) returns the event', async () => {
    const req = new Request('https://shop.example/api/referalli', { method: 'POST', body, headers: sign(body) });
    await expect(verifyWebhook(req, { secret })).resolves.toMatchObject({ topic: 'referral.created' });
  });

  it('createWebhookHandler dispatches by topic and rejects bad signatures', async () => {
    const onCreated = vi.fn();
    const POST = createWebhookHandler({ secret, on: { 'referral.created': onCreated } });
    const ok = await POST(new Request('https://x', { method: 'POST', body, headers: sign(body) }));
    expect(ok.status).toBe(200);
    expect(onCreated).toHaveBeenCalledWith(expect.objectContaining({ data: { referralId: 'ref_1' } }));
    const bad = await POST(new Request('https://x', { method: 'POST', body: body + ' ', headers: sign(body) }));
    expect(bad.status).toBe(400);
    expect(await bad.json()).toMatchObject({ reason: 'signature' });
  });
});
