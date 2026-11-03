# Changelog

## 0.4.1 - 2026-11-03

- New `@referalli/next/server` entry: `<ReferralPanel>` as a React Server Component. Given `customerRef` (or `getCustomerRef()` from your session), it fetches the user's code and link with your API key (`POST /v1/widget/tokens`, then `GET /t/{tk}/widget/me`) and renders them with a copy button, with no `widget.js`. It renders nothing when the user is not enrolled. `live` swaps to the live widget after hydration. `getReferralPanel()` returns the data.

## 0.4.0 - 2026-11-03

- Middleware: `consent: 'cookiemunch'` (or `{ cookiemunch: { category } }`) reads Cookie Munch's `CookieMunch` consent cookie. The category defaults to `referrals` with a fallback to `marketing`, as aff.js does. Until the visitor decides, no cookie is set. The function form of `consent` still works.
- Middleware: with the Cookie Munch reader and `publishableKey`, a landing with no decision yet is recorded without a cookie, marked `unknown`. The function form still sends nothing until a decision. A granted landing's evidence carries the CMP's provider and Cookie Munch's stamp.
- README: the first example sets `consent: 'cookiemunch'`, and a new Consent section explains the options. Without `consent`, the default is still always granted.
- New `@referalli/next/client` entry (`'use client'`): re-exports `ReferralPanel` and `ReferalliProvider` from `@referalli/react`, now a dependency. `<ReferralPanel programId="prg_…" auth="atlas" />` renders the signed-in referral panel.

## 0.3.0 - 2026-11-02

- Depends on `referalli` ^0.3.0 (the `referalli/webhooks` entry point, new endpoints and typed errors).

## 0.2.0 - 2026-10-24

- API 2026-11-01 additions: 56 new operations (inbound signup connectors, billing product filters, per-org SSO and partner-portal sign-in, support-tool context cards, data-rights executors, account closure, rewards, integration health, plans, the event feed and bulk webhook replay) and 2 webhook topics (`webhook_endpoint.failing`, `webhook_endpoint.recovered`).
- New error code `reauth_required` (401): sign in again before changing payout details.

## 0.1.1

- Fixed: the published package now points at the built `dist/` output. 0.1.0 was published with its entry points at TypeScript source and could not be imported; it is deprecated.

## 0.1.0 (2026-10-23)

- First release of `@referalli/next`.
