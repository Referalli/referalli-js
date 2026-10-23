import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { constructWebhookEvent, verifyWebhook, webhooks, WebhookVerificationError } from '../src/webhooks.js';

interface Vector {
  name: string;
  body: string;
  headers: Record<string, string>;
  secrets: string[];
  now: number;
  valid: boolean;
}
// The same vectors every Referalli SDK verifier is tested against.
const { cases } = JSON.parse(
  readFileSync(new URL('../../../testdata/webhook-vectors.json', import.meta.url), 'utf8'),
) as { cases: Vector[] };

describe('verifyWebhook', () => {
  it.each(cases)('$name', (c) => {
    expect(verifyWebhook(c.body, c.headers, c.secrets, { now: new Date(c.now * 1000) })).toBe(c.valid);
  });

  it('accepts a fetch Headers object', () => {
    const c = cases.find((v) => v.name === 'valid')!;
    expect(verifyWebhook(c.body, new Headers(c.headers), c.secrets, { now: new Date(c.now * 1000) })).toBe(true);
  });

  it('constructWebhookEvent parses a valid delivery and throws on a bad one', () => {
    const ok = cases.find((v) => v.name === 'valid')!;
    expect(constructWebhookEvent(ok.body, ok.headers, ok.secrets, { now: new Date(ok.now * 1000) })).toMatchObject({
      topic: 'referral.created',
    });
    const old = cases.find((v) => v.name === 'too old')!;
    expect(() => constructWebhookEvent(old.body, old.headers, old.secrets, { now: new Date(old.now * 1000) })).toThrow(
      WebhookVerificationError,
    );
  });
});

describe('webhooks (async, WebCrypto)', () => {
  it.each(cases)('$name', async (c) => {
    expect(await webhooks.verify(c.body, c.headers, c.secrets, { now: c.now * 1000 })).toBe(c.valid);
  });

  it('agrees with packages/webhooks signing on a fresh delivery (bytes body, rotation, header case)', async () => {
    const secret = 'whsec_' + Buffer.from('k'.repeat(24)).toString('base64');
    const body = JSON.stringify({ id: 'evt_9', topic: 'payout.sent', orgId: 'org_1', createdAt: '2026-10-21T12:00:00Z', data: { amountMinor: 1200 } });
    const ts = 1792600000;
    // packages/webhooks signStandardWebhook: HMAC-SHA256(base64-decoded key, `${id}.${ts}.${body}`), base64.
    const sig = createHmac('sha256', Buffer.from(secret.slice(6), 'base64')).update(`whd_1.${ts}.${body}`).digest('base64');
    const headers = { 'Webhook-Id': 'whd_1', 'Webhook-Timestamp': String(ts), 'Webhook-Signature': `v1,${sig}` };
    const opts = { now: ts * 1000 };
    expect(verifyWebhook(new TextEncoder().encode(body), headers, ['whsec_b2xk', secret], opts)).toBe(true);
    expect(await webhooks.verify(Buffer.from(body), headers, ['whsec_b2xk', secret], opts)).toBe(true);
    const event = await webhooks.constructEvent(body, headers, secret, opts);
    expect(event).toMatchObject({ topic: 'payout.sent', data: { amountMinor: 1200 } });
    expect(await webhooks.verify(body + ' ', headers, secret, opts)).toBe(false);
  });

  it('says why a delivery was rejected', async () => {
    const ok = cases.find((v) => v.name === 'valid')!;
    const reason = async (headers: Record<string, string>, now = ok.now) =>
      webhooks.constructEvent(ok.body, headers, ok.secrets, { now: now * 1000 }).catch((e: WebhookVerificationError) => e.reason);
    expect(await reason({})).toBe('missing_headers');
    expect(await reason(ok.headers, ok.now + 10_000)).toBe('timestamp');
    expect(await reason({ ...ok.headers, 'webhook-signature': 'v1,AAAA' })).toBe('signature');
  });
});
