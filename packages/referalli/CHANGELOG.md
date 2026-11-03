# Changelog

## 0.3.3 - 2026-11-03

- Types for billing account renames and deletions: `previousAccountRef` on `PUT /v1/billing/accounts/{accountRef}/owner`, `DELETE /v1/billing/accounts/{accountRef}`, and `billing_account.owner_changed` with `previousAccountRef`, `deleted` and a nullable `ownerCustomerRef`.

## 0.3.2 - 2026-11-03

- Cookie-free hand-off: `getHandoffToken()` on `aff.js` (`window.aff`) and the `referalli/browser` tracker returns a signed token of the visit's referral context (24 h, consent rules apply); `associate({ handoffToken })` on the Node client, and `referalliAuthEvents`' `getReferral` can return one.
- Typed client for the new endpoints: `GET /v1/org/tracking-tokens`, `POST /v1/referrals/handoff-tokens`, `GET`/`PUT /v1/billing/accounts/{accountRef}`, and the `billing_account.owner_changed` webhook event; error class for `invalid_handoff_token`.
- New `createOutbox({ store, connectionId, secret? })`: a durable queue for `generic` billing events. `enqueue(event)` stores it, `flush()` sends what is due (signed `POST /webhooks/billing/{id}`, or `POST /v1/billing/connections/{id}/events` with the API key) and retries failures with backoff (30 s doubling to 1 h, 50 attempts by default). Redelivery is safe: events are keyed by `providerEventId`. Ships `memoryOutboxStore()` and the `OutboxStore` interface for your own table.

## 0.3.1 - 2026-11-03

- New endpoints: `POST /v1/billing/connections/{id}/events` (billing events with an API key), `GET /v1/programs/handle-availability`, `PUT /v1/auth/connections/{id}/origins`, `GET /v1/auth/connections/{id}`; `terms` on public program pages; the `signup_and_pay` sandbox scenario; `name` and `scopes` on `PATCH /v1/api-keys/{id}`.
- Served `aff.js`: `data-cookie-domain` is used only when the page's host is on that domain (and has two labels); a refused domain cookie is rewritten host-only.

## 0.3.0 - 2026-11-02

- New `referalli/webhooks` entry point: verify and parse webhook deliveries without the full client.
- API additions: one-call referrers (`POST /v1/programs/{id}/referrers`), partner summary, `GET /v1/programs?slug=`, `portalUrl` on the org, portal links, program-scoped API keys and the Stripe balance credit rail.
- New typed errors `ProgramScopedKeyError` (403), `RestrictedSessionError` (403) and `StripeKeyRequiredError`.
- Also in this release: API key rotate, `apiVersion: "latest"`, enrollment `mint`, partner upsert `matchedBy`, paused webhook create and `programId` filter, per-program Stripe credit key, Stripe credit requeue, `effectiveAt` filters on FX rates and Stripe fixture replay (`/v1/sandbox/stripe-fixtures`).
- New typed errors `StripeKeyInvalidError`, `StripeKeyWrongModeError`, `StripeKeyPermissionError` (422), `StripeUnavailableError` (502) and `ApiKeyExpiredError` (409).
- Fixed: `(id, options)` calls keep working when a method gains a query parameter (options passed in the query slot are moved back).

## 0.2.0 - 2026-10-24

- API 2026-11-01 additions: 56 new operations (inbound signup connectors, billing product filters, per-org SSO and partner-portal sign-in, support-tool context cards, data-rights executors, account closure, rewards, integration health, plans, the event feed and bulk webhook replay) and 2 webhook topics (`webhook_endpoint.failing`, `webhook_endpoint.recovered`).
- New error code `reauth_required` (401): sign in again before changing payout details.
- Consent: `aff.js` and `referalli/browser` follow the merchant's consent manager (Cookie Munch, IAB TCF v2.2/GPP, Google Consent Mode v2, OneTrust, Cookiebot, Usercentrics, Didomi, Osano, Termly or a custom callback).
- The attribution cookie is written as `referalli_ctx` and the legacy `referally_ctx` twin, and either is read.

## 0.1.1

- Fixed: the published package now points at the built `dist/` output. 0.1.0 was published with its entry points at TypeScript source and could not be imported; it is deprecated.

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
