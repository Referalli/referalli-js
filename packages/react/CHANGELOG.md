# Changelog

## 0.2.0 - 2026-10-24

- API 2026-11-01 additions: 56 new operations (inbound signup connectors, billing product filters, per-org SSO and partner-portal sign-in, support-tool context cards, data-rights executors, account closure, rewards, integration health, plans, the event feed and bulk webhook replay) and 2 webhook topics (`webhook_endpoint.failing`, `webhook_endpoint.recovered`).
- New error code `reauth_required` (401): sign in again before changing payout details.

## 0.1.1

- Fixed: the published package now points at the built `dist/` output. 0.1.0 was published with its entry points at TypeScript source and could not be imported; it is deprecated.

## 0.1.0 (2026-10-23)

- First release of `@referalli/react`.
