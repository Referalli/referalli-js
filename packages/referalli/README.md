# referalli

The official Referalli SDK for JavaScript and TypeScript. It calls every API operation with full types, verifies webhooks, and includes a small browser referral tracker.

- Every one of the 376 `/v1` operations, grouped by resource, with request, query and response types generated from the OpenAPI document
- Retries with backoff and jitter that honour `Retry-After`, timeouts, idempotency keys and typed errors
- Auto-paging with `for await`
- Webhook verification with typed events
- Runs on Node 20+, Bun, Deno, Cloudflare Workers, Vercel Edge and browsers (`referalli/browser`)
- ESM and CommonJS, no dependencies

```sh
npm install referalli
```

Framework kits: [`@referalli/react`](https://www.npmjs.com/package/@referalli/react), [`@referalli/next`](https://www.npmjs.com/package/@referalli/next), [`@referalli/express`](https://www.npmjs.com/package/@referalli/express).

## Quickstart

Keep your secret `rk_` key on your server.

```ts
import { Referalli } from 'referalli';

const referalli = new Referalli({ apiKey: process.env.REFERALLI_API_KEY });
```

### Create a referral link

```ts
const partner = await referalli.partners.create({ email: 'dana@example.com', displayName: 'Dana' });
const link = await referalli.links.create({
  programId: 'prg_...',
  partnerId: partner.id,
  destinationUrl: 'https://example.com/pricing',
});
console.log(link.shortUrl ?? `https://example.com/pricing?via=${link.code}`); // share this
```

### Track a signup and a conversion

When someone signs up, attribute them to the partner who referred them. The referral context comes from the browser tracker or from the `@referalli/next` and `@referalli/express` cookie middleware:

```ts
await referalli.associate({
  programId: 'prg_...',
  customerRef: user.id, // the id your billing provider sees
  anonId: referral.anonId,
  referralToken: referral.clickId ?? undefined,
  idempotencyKey: `signup:${user.id}`,
});
```

Payments from a connected billing provider (Stripe, Paddle and others) earn commissions on their own. To report a product event that pays a bounty:

```ts
await referalli.trackEvent({
  programId: 'prg_...',
  customerRef: user.id,
  event: 'activation',
  idempotencyKey: `activation:${user.id}`,
});
```

To report value facts for ROI, such as a payment that was partly covered by store credit:

```ts
await referalli.reportPayment({
  customerRef: user.id,
  currency: 'usd',
  cashMinor: 4900,
  creditAppliedMinor: 1000,
  externalId: invoice.id,
  occurredAt: invoice.paidAt,
});
```

### Verify a webhook

Webhooks are signed with [Standard Webhooks](https://www.standardwebhooks.com). Verify the raw body exactly as you received it.

**Next.js (App Router):**

```ts
// app/api/referalli/route.ts
import { webhooks } from 'referalli';

export async function POST(req: Request) {
  const event = await webhooks.constructEvent(await req.text(), req.headers, process.env.REFERALLI_WEBHOOK_SECRET!);
  switch (event.topic) {
    case 'referral.created':
      // event.data is typed for this topic
      break;
  }
  return Response.json({ received: true });
}
```

`@referalli/next` wraps this as `createWebhookHandler({ secret, on: { 'referral.created': … } })`.

**Express:**

```ts
import express from 'express';
import { webhooks, WebhookVerificationError } from 'referalli';

app.post('/webhooks/referalli', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = await webhooks.constructEvent(req.body, req.headers, process.env.REFERALLI_WEBHOOK_SECRET!);
    // handle event.topic
    res.json({ received: true });
  } catch (err) {
    if (err instanceof WebhookVerificationError) return res.status(400).json({ error: err.message });
    throw err;
  }
});
```

`@referalli/express` wraps this as the `referalliWebhook({ secret })` middleware, which also handles the raw body.

Deliveries signed more than 5 minutes ago, or more than 5 minutes in the future, are rejected (set this with `toleranceSec`). While you rotate a secret, pass both secrets as an array. `verifyWebhook(rawBody, headers, secret)` is a synchronous version that returns a boolean.

## Configuration

```ts
const referalli = new Referalli({
  apiKey: 'rk_live_...',          // default: process.env.REFERALLI_API_KEY
  baseUrl: 'https://referalli.com', // default; or process.env.REFERALLI_BASE_URL
  timeout: 60_000,                // ms per attempt
  maxRetries: 2,                  // retries after the first attempt
  retryBaseDelay: 500,            // ms, doubled per retry with jitter, max 8 s
  apiVersion: '2026-11-01',       // sent as referalli-version; default: the version this SDK was generated against
  mode: 'test',                   // sent as referalli-mode (session auth only; a key's mode is fixed)
  fetch: customFetch,             // default: global fetch
  headers: { 'x-team': 'growth' },
});
```

You can override settings for a single request in the last argument:

```ts
await referalli.partners.create(
  { email: 'kai@example.com' },
  { idempotencyKey: `invite:${id}`, timeout: 5_000, maxRetries: 0, signal: controller.signal },
);
```

**Retries.** A request is retried when the network fails, when it times out, and on `408`, `429`, `500`, `502`, `503` and `504`. The wait is `Retry-After` when the API sends one. Only requests that are safe to repeat are retried: `GET`, `PUT` and `DELETE`, plus any request with an idempotency key. Every `POST` gets a generated key, and the same key is sent on each retry, so a retried POST is never applied twice.

## Errors

Every error extends `ReferalliError`.

| Class | When |
|---|---|
| `ApiError` | The API answered with an error. It has `status`, `code`, `requestId`, `docsUrl`, `details` and `retryAfter`. |
| `NotFoundError`, `ValidationError`, `RateLimitedError`, `AuthenticationError`, `PermissionDeniedError`, `ConflictError`, … | One subclass of `ApiError` for each [error code](https://referalli.com/docs/errors-and-limits). |
| `ApiConnectionError` | The API could not be reached, after all retries. |
| `ApiTimeoutError` | The request timed out, after all retries. |
| `WebhookVerificationError` | A webhook failed verification. `reason` is `missing_headers`, `timestamp` or `signature`. |

```ts
import { NotFoundError, RateLimitedError } from 'referalli';

try {
  await referalli.partners.retrieve('ptr_missing');
} catch (err) {
  if (err instanceof NotFoundError) console.log(err.code, err.requestId);
  else if (err instanceof RateLimitedError) console.log('retry in', err.retryAfter, 's');
  else throw err;
}
```

## Paging

A list method returns a `ListPromise`. You can use it in three ways:

```ts
// One page: { object: 'list', data, has_more, next_cursor }
const page = await referalli.partners.list({ limit: 50 });

// Every item, fetching pages as you go
for await (const partner of referalli.partners.list({ limit: 100 })) {
  console.log(partner.id);
}

// Into an array, with a cap
const all = await referalli.partners.list().toArray({ limit: 1_000 });
```

`.pages()` iterates page by page. Nothing is requested until you await or iterate.

## Every operation

Methods follow the API paths: `referalli.programs.enrollments.approve(programId, enrollmentId)`, `referalli.webhookEndpoints.rotateSecret(id)` and `referalli.analytics.overview()`. You can also call any operation by its `operationId`:

```ts
await referalli.call('getPartnersId', { path: { id: 'ptr_1' } });
for await (const r of referalli.listAll('getReferrals', { query: { limit: 100 } })) {}
```

To send a raw request with the client's auth, retries and error handling, use `referalli.request({ method, path, query, body })`.

The API's types are exported from the package root (`import type { Partner, Program } from 'referalli'`) and from `referalli/types`.

## Browser tracker

Only your public tracking token goes in the browser, never an `rk_` key.

```ts
import { createTracker } from 'referalli/browser';

const tracker = await createTracker({ publishableKey: 'tok_...' });
tracker.getReferral(); // { anonId, code, clickId, ts }
// after signup:
await tracker.trackSignup({ customerRef: user.id, email: user.email });
```

The tracker reads `?via=`, `?ref=` or `?aff=` and `ref_click_id` from the landing URL. It keeps the referral in a first-party cookie on your domain and records the visit. Options: `persist: 'referral-only'` (use before consent), `cookieDays`, `firstTouch` and `cookieDomain`. Call `tracker.forget()` when a visitor withdraws consent.

## License

MIT
