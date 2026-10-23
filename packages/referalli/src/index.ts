/**
 * `referalli`: the official Referalli SDK for JavaScript and TypeScript.
 * Server-side client (`Referalli`), typed errors, webhook verification and the
 * referral-context helpers. The browser tracker is `referalli/browser`.
 */
export { Referalli, Referalli as default, DEFAULT_BASE_URL, type RawRequest, type ReferalliOptions } from './client.js';
export {
  ListPromise,
  type HttpMethod,
  type ListEnvelope,
  type OperationInput,
  type OperationSpec,
  type PageParams,
  type QueryValue,
  type RequestOptions,
} from './core.js';
export { ApiConnectionError, ApiError, ApiTimeoutError, ReferalliError, type ApiErrorInit } from './errors.js';
export * from './errors.generated.js';
export { API_VERSION, operations, type OperationId, type Resources } from './resources.generated.js';
export { SDK_VERSION } from './version.js';
export {
  constructWebhookEvent,
  verifyWebhook,
  webhooks,
  WebhookVerificationError,
  WEBHOOK_TOLERANCE_SEC,
  type VerifyOptions,
  type WebhookEnvelope,
  type WebhookEvent,
  type WebhookEventOf,
  type WebhookFailure,
  type WebhookHeaders,
  type Webhooks,
  type WebhookTopic,
} from './webhooks.js';
export {
  associateFields,
  hashEmail,
  mergeReferral,
  newAnonId,
  parseReferral,
  REFERRAL_COOKIE,
  REFERRAL_PARAMS,
  referralFromCookieHeader,
  referralFromUrl,
  serializeReferralCookie,
  type CookieOptions,
  type ReferralContext,
  type StoredReferral,
} from './attribution.js';
// Every API type (`Program`, `Partner`, `PostLinksBody`, `GetReferralsResponse`, …).
export type * from './generated.js';

// Kept for existing integrations and the API server.
export { initSnippet, type AffApi, type SnippetConfig, type SnippetEnv } from './snippet.js';
export { renderSnippetJs } from './served.js';
export {
  ReferalliClient,
  referalliAuthEvents,
  SDK_API_VERSION,
  type Associates,
  type AuthEventsOptions,
  type ListPage,
  type ReferalliClientOptions,
} from './node.js';
export { createMobileClient, type MobileClientOptions } from './mobile.js';
