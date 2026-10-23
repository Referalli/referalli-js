# Changelog

## 0.1.0 (2026-10-23)

First release as `referalli`.

- `Referalli` client generated from the OpenAPI document: all 376 `/v1` operations as typed methods grouped by resource (`referalli.programs.list()`, `referalli.referrals.void(id)`), with request, query and response types.
- Retries with exponential backoff and jitter for network errors, timeouts, 408, 429 and 5xx, honouring `Retry-After`. Only idempotent requests and requests with an idempotency key are retried. Every POST gets an idempotency key, and the same key is sent on each retry.
- Per-attempt timeouts, `AbortSignal` support, and one error class per API error code (`NotFoundError`, `RateLimitedError`, …).
- Auto-paging: list methods can be awaited for one page or iterated with `for await` to get every item.
- Webhooks: `webhooks.constructEvent()` (async, WebCrypto) returns typed events, and `verifyWebhook()` / `constructWebhookEvent()` (sync) work in every runtime. Both use constant-time comparison, a 5-minute tolerance and rotation-safe multiple secrets.
- `referalli/browser`: a small referral tracker (`createTracker`, `getReferral`).
- `referalli/attribution`: helpers for the first-party referral cookie, shared with `@referalli/next` and `@referalli/express`.
- Dual ESM/CJS with types. Runs on Node 20+, Bun, Deno and edge runtimes.
