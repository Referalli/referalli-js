/** The README's samples, type-checked (never run). */
import { NotFoundError, RateLimitedError, Referalli, webhooks, type Partner } from '../src/index.js';
import { createTracker } from '../src/browser.js';

export async function readme(user: { id: string; email: string }, referral: { anonId: string; clickId: string | null }, invoice: { id: string; paidAt: string }, req: Request) {
  const referalli = new Referalli({ apiKey: process.env.REFERALLI_API_KEY });
  const partner = await referalli.partners.create({ email: 'dana@example.com', displayName: 'Dana' });
  const link = await referalli.links.create({ programId: 'prg_...', partnerId: partner.id, destinationUrl: 'https://example.com/pricing' });
  console.log(link.shortUrl ?? `https://example.com/pricing?via=${link.code}`);
  await referalli.associate({ programId: 'prg_...', customerRef: user.id, anonId: referral.anonId, referralToken: referral.clickId ?? undefined, idempotencyKey: `signup:${user.id}` });
  await referalli.trackEvent({ programId: 'prg_...', customerRef: user.id, event: 'activation', idempotencyKey: `activation:${user.id}` });
  await referalli.reportPayment({ customerRef: user.id, currency: 'usd', cashMinor: 4900, creditAppliedMinor: 1000, externalId: invoice.id, occurredAt: invoice.paidAt });
  const event = await webhooks.constructEvent(await req.text(), req.headers, 'whsec_x');
  console.log(event.topic, event.data);
  const controller = new AbortController();
  await referalli.partners.create({ email: 'kai@example.com' }, { idempotencyKey: 'invite:1', timeout: 5_000, maxRetries: 0, signal: controller.signal });
  try {
    await referalli.partners.retrieve('ptr_missing');
  } catch (err) {
    if (err instanceof NotFoundError) console.log(err.code, err.requestId);
    else if (err instanceof RateLimitedError) console.log(err.retryAfter);
  }
  const page = await referalli.partners.list({ limit: 50 });
  const first: Partner | undefined = page.data[0];
  for await (const p of referalli.partners.list({ limit: 100 })) console.log(p.id, first);
  await referalli.partners.list().toArray({ limit: 1_000 });
  await referalli.programs.enrollments.approve('prg_1', 'enr_1');
  await referalli.webhookEndpoints.rotateSecret('we_1');
  await referalli.analytics.overview();
  await referalli.call('getPartnersId', { path: { id: 'ptr_1' } });
  await referalli.request({ method: 'GET', path: '/v1/health' });
  const tracker = await createTracker({ publishableKey: 'tok_...' });
  tracker.getReferral();
  await tracker.trackSignup({ customerRef: user.id, email: user.email });
}
