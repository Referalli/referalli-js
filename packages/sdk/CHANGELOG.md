# Changelog

## 0.3.27 - 2026-11-20

- Types for payout connections bound to programs (`programIds`, `id`), the `POST /v1/payout-runs` body `{programIds, dryRun}`, `payoutConnectionId` and `provider` on planned payouts, and the `no_payout_connection` error.

## 0.3.26 - 2026-11-19

- Types for `outstandingByProgram` on `GET /v1/partners/{id}/clawbacks` and the partner portal's `GET /v1/partner/clawbacks`.

## 0.3.25 - 2026-11-19

- Types for payout clawbacks: the program setting `clawbackPaidReversals`, `clawbackMinor` on payouts and invoices, `GET /v1/partners/{id}/clawbacks` and the `payout.clawback_recorded` webhook.

## 0.3.24 - 2026-11-19

- Types for native import `payout` rows and commission `orderRef`, `grossMinor`, `bps`, `strictlyBelowBase`; `Payout.imported` and `POST /v1/payouts/{id}/status`; `subId` and `productId` on server touches; `notificationEmails.disabled`; `counterpartyCustomerRef` / `counterpartyPartnerRef` on billing events.

## 0.3.23 - 2026-11-19

- Types for the `order.attributed` and `order.refunded` webhooks and `visitToken` (server touches, `referral.*` events, referrals). The served `aff.js` passes the Seolyticize visit token (or `data-visit-token`) with the visit.

## 0.3.22 - 2026-11-19

- **Added:** request option `signWith` (the connection secret) for signature-auth routes such as `billing.connections.stripeForward`: signs the exact body sent as `x-referalli-signature: t=,v1=`, sends no API key, and needs none. The Stripe forward body accepts a `Stripe.Event` without a cast.

## 0.3.21 - 2026-11-19

- Generated types for the program setting `merchantCreditBps` (part of each commission line paid as merchant credit, the rest as cash).

## 0.3.20 - 2026-11-18

- Published as `@referalli/sdk`. The unscoped `referalli` package stays at 0.3.16; install `@referalli/sdk` and change imports from `referalli` (and `referalli/browser`, ...) to `@referalli/sdk` (`@referalli/sdk/browser`, ...). Nothing else changed.
- Generated types for the program settings `payoutTaxFormPolicy` and `recordCountry`, `enableWidget` / `widgetEnabled` on auth connections, the typed `GenericBillingEvent` (with top-level `customerCreatedAt`), native import row types (`NativeImportRow`) and its dry-run report, the referee reward `issueOn` option and the `referee_reward` sandbox scenario. 0.3.19 was never published to npm; this release includes its changes.

## 0.3.19 - 2026-11-18

- Generated types and methods for per-purchase attribution (`attributionScope`, `productMatch`), link `label`, `status`, `cookieWindowDays`, `commission` and `conditions`, lookups by `code`, `PATCH /v1/coupons/{id}`, per-link timeseries, `commissionBaseMinor` and `maxCommissionMinor` on billing events and mobile purchases, rule `capPerPayment`, `effectiveAt` and the `first_earning_payment_after_referral` recurring type, mirrored referee rewards and the `referee_reward.reversed` webhook, `riskPolicy.minCustomerAgeDays` / `requirePriorPayment`, `payoutTaxFormPolicy`, per-line hold and approve, the `daily` payout schedule, server touches with `customerRef`, `productRef`, `kind` and `metadata`, native import (`POST /v1/import/native`), and linked programs with `exclusiveWith` / `priority`.

## 0.3.18 - 2026-11-18

- Generated types and methods for deep links (`POST /v1/partner/links/deep`), smartlinks (`/v1/partner/smartlinks`), partner product and coupon feeds (`/v1/partner/feeds/products`, `/v1/partner/feeds/coupons`), the program `caps`, `countries`, `trafficSources` and `payPerCall` settings, pay-per-call connections, numbers and calls, and `trafficSources` / `promotionUrl` on partner applications. The served `aff.js` loads `calls.js` with `data-calls="swap"` to show a referred visitor the partner's phone number. 0.3.17 was never published to npm; this release includes its changes.

## 0.3.17 - 2026-11-18

- Generated types and methods for product-scoped promotions (`scope`), earnings `bonuses` on commission rules, the program `cartWindowDays` setting, and `GET /v1/partner/links/match`.
- The served `aff.js` adds `referalli.cartAdd({productId, sku, quantity})` and, with `data-cart="auto"`, records Shopify and WooCommerce add-to-cart events for the cart extension.

## 0.3.16 - 2026-11-18

- Generated types and methods for the product catalog (`/v1/catalog/items`, feeds and sync), one-step store setup (`/v1/programs/{id}/store-setup`), partner product search and one-click product links (`/v1/partner/catalog`, `/v1/partner/links/product`), partner storefronts and the public storefront, sub-ID filters on stats and product reports, and the program `storefronts` setting.
- The served `aff.js` records `sub` (a sub-ID) on referral visits and can show the opt-in partner "get link" bar (`data-partner-bar="on"`).

## 0.3.15 - 2026-11-18

- Generated types and methods for store affiliate programs: `rateCard` on commission rules (per-category rates, excluded categories, `productCategories`, `indirectBps`), `lines` on generic billing events, `productRef` on links, `lineItems` on `commission.earned`, and the product reports (`GET /v1/reports/products`, `GET /v1/partner/reports/products`).

## 0.3.14 - 2026-11-18

- Generated types for what the API added today: `draft` on commission rules and on `GET /v1/programs/{id}/terms`, a program's `creditRate` and `credits` on `commission.settled`, and `programIds` on DSAR executor keys.

## 0.3.13 - 2026-11-18

- `stripeEventToBillingEvents` maps `checkout.session.completed` and `checkout.session.async_payment_succeeded` for a paid one-time Checkout with no invoice (`mode: payment`, no `invoice_creation`) to an `invoice_paid` keyed by its payment intent, so a one-time price earns. A session with an invoice is left to `invoice.paid`, never both. A guest with no Stripe customer is filed under `client_reference_id`, else the payment intent, which the session's metadata then links. `charge.refunded` and `charge.dispute.created` with no invoice carry the payment intent too, so they reverse it.
- Generated types and methods for what the API added since 0.3.12: program email settings and their test send, `trackingToken` and `effectiveTrackingConsent` on a program, `capPerReferral`, `domainDetail`, the test-mode partner delete's `removed`, and `graceHours` on secret rotation.

## 0.3.12 - 2026-11-11

- `stripeEventToBillingEvents` reads an invoice's linked id from `parent.subscription_details.metadata` even when the event also has a top-level `subscription_details`; sources merge with the invoice's own metadata winning, then subscription details, then the first line.
- Generated types for the new fields: dry-run `linkedCustomerRef`/`linkedFrom`/`billingAccount`, auth connection `lastRejectedAt`/`lastRejectedReason`, health check `severity`, and the program link-domain routes.

## 0.3.11 - 2026-11-11

- `sqliteOutboxStore({ execute })`: a durable outbox for SQLite and libSQL apps, next to `pgOutboxStore`.
- Generated methods for the new routes: link update and repoint, Stripe event forwarding, billing dry-run, org alerts, and the new program fields (`brand`, `termsUrl`, `faqUrl`, `supportUrl`, `trackingConsent`, `notificationEmails`, `howItWorksMd`).

## 0.3.10 - 2026-11-07

- Generated method for `PUT /v1/programs/{id}/commission-rule`, which publishes a rule only if it changed.

## 0.3.9 - 2026-11-07

- The payment-limit warning has a rate for every current currency, so a Syrian pound or similar payment no longer warns as if each unit were a dollar.

## 0.3.8 - 2026-11-07

- The `enqueue` warning over the payment limit now converts the amount to approximate US dollars first, as the server does, so an ordinary rupiah or yen payment no longer warns. Refunds and other events never warn: only payments are held.

## 0.3.7 - 2026-11-05

- `createOutbox.enqueue` warns when `amountGross` is over 1,000,000,000 minor units, the server's default limit. The event is still sent: the server holds it for release instead of refusing it.

## 0.3.6 - 2026-11-05

- `createOutbox.enqueue` also throws on a negative `amountGross` and on a currency that isn't ISO 4217, matching the server.

## 0.3.5 - 2026-11-05

- `createOutbox.enqueue` throws on what the server could only refuse: an unknown type, a non-integer amount, a missing or unparseable `occurredAt`, a bad currency, a missing `customerRef`.
- A `400` or `422` on send marks the event dead at once and fires `onDead`. `401`, `403`, `404`, `429` and `5xx` keep retrying.

## 0.3.4 - 2026-11-05

- New `pgOutboxStore({ query, table })`: an `OutboxStore` on a Postgres table through your own query function, with `migrate()` and `dead()`. It claims rows with `FOR UPDATE SKIP LOCKED` and a 5-minute lease, so replicas don't send one row twice and a row held by a dead process is retried.
- `OutboxStore` gains an optional `claim(now, leaseMs)`; stores without it work as before. New `onDead` option on `createOutbox`, called when an event hits `maxAttempts`.
- New `stripeEventToBillingEvents(event, { customerRef })`: maps `invoice.paid`, `charge.refunded`, `charge.dispute.created`, `customer.subscription.created` and `.deleted` to generic billing events, with no `stripe` dependency.
- New `buildBillingEvent()`: throws on `amountMinor` (the field is `amountGross`).
- Fixed: the outbox's retry time is a whole number of milliseconds, so a `bigint` column accepts it. The signed route's send now times out after 60 s instead of hanging a flush.

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
