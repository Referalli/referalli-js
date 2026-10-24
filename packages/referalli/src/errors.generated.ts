// Generated from the Referalli OpenAPI document by packages/sdkgen. Do not edit by hand:
// run `pnpm --filter referalli gen` after changing the API.
import { ApiError } from './errors.js';

/** `validation_error` (HTTP 400). */
export class ValidationError extends ApiError {
  override readonly name: string = "ValidationError";
}

/** `mode_mismatch` (HTTP 400). */
export class ModeMismatchError extends ApiError {
  override readonly name: string = "ModeMismatchError";
}

/** `bad_request` (HTTP 400). */
export class BadRequestError extends ApiError {
  override readonly name: string = "BadRequestError";
}

/** `unauthorized` (HTTP 401). */
export class AuthenticationError extends ApiError {
  override readonly name: string = "AuthenticationError";
}

/** `step_up_required` (HTTP 401). */
export class StepUpRequiredError extends ApiError {
  override readonly name: string = "StepUpRequiredError";
}

/** `reauth_required` (HTTP 401). */
export class ReauthRequiredError extends ApiError {
  override readonly name: string = "ReauthRequiredError";
}

/** `payment_required` (HTTP 402). */
export class PaymentRequiredError extends ApiError {
  override readonly name: string = "PaymentRequiredError";
}

/** `forbidden` (HTTP 403). */
export class PermissionDeniedError extends ApiError {
  override readonly name: string = "PermissionDeniedError";
}

/** `webhooks_disabled` (HTTP 403). */
export class WebhooksDisabledError extends ApiError {
  override readonly name: string = "WebhooksDisabledError";
}

/** `sso_required` (HTTP 403). */
export class SsoRequiredError extends ApiError {
  override readonly name: string = "SsoRequiredError";
}

/** `access_suspended` (HTTP 403). */
export class AccessSuspendedError extends ApiError {
  override readonly name: string = "AccessSuspendedError";
}

/** `not_found` (HTTP 404). */
export class NotFoundError extends ApiError {
  override readonly name: string = "NotFoundError";
}

/** `conflict` (HTTP 409). */
export class ConflictError extends ApiError {
  override readonly name: string = "ConflictError";
}

/** `idempotency_in_progress` (HTTP 409). */
export class IdempotencyInProgressError extends ApiError {
  override readonly name: string = "IdempotencyInProgressError";
}

/** `replay` (HTTP 409). */
export class ReplayError extends ApiError {
  override readonly name: string = "ReplayError";
}

/** `live_mode_only` (HTTP 409). */
export class LiveModeOnlyError extends ApiError {
  override readonly name: string = "LiveModeOnlyError";
}

/** `test_mode_only` (HTTP 409). */
export class TestModeOnlyError extends ApiError {
  override readonly name: string = "TestModeOnlyError";
}

/** `test_mode_unsupported` (HTTP 409). */
export class TestModeUnsupportedError extends ApiError {
  override readonly name: string = "TestModeUnsupportedError";
}

/** `gone` (HTTP 410). */
export class GoneError extends ApiError {
  override readonly name: string = "GoneError";
}

/** `idempotency_key_reused` (HTTP 422). */
export class IdempotencyKeyReusedError extends ApiError {
  override readonly name: string = "IdempotencyKeyReusedError";
}

/** `payload_too_large` (HTTP 413). */
export class PayloadTooLargeError extends ApiError {
  override readonly name: string = "PayloadTooLargeError";
}

/** `connection_paused` (HTTP 423). */
export class ConnectionPausedError extends ApiError {
  override readonly name: string = "ConnectionPausedError";
}

/** `rate_limited` (HTTP 429). */
export class RateLimitedError extends ApiError {
  override readonly name: string = "RateLimitedError";
}

/** `internal_error` (HTTP 500). */
export class InternalServerError extends ApiError {
  override readonly name: string = "InternalServerError";
}

/** `atlas_error` (HTTP 502). */
export class AtlasError extends ApiError {
  override readonly name: string = "AtlasError";
}

/** `sso_provider_error` (HTTP 502). */
export class SsoProviderError extends ApiError {
  override readonly name: string = "SsoProviderError";
}

/** `sso_not_configured` (HTTP 503). */
export class SsoNotConfiguredError extends ApiError {
  override readonly name: string = "SsoNotConfiguredError";
}

/** The error class for each API error code. */
export const errorClasses: Record<string, typeof ApiError> = {
  validation_error: ValidationError,
  mode_mismatch: ModeMismatchError,
  bad_request: BadRequestError,
  unauthorized: AuthenticationError,
  step_up_required: StepUpRequiredError,
  reauth_required: ReauthRequiredError,
  payment_required: PaymentRequiredError,
  forbidden: PermissionDeniedError,
  webhooks_disabled: WebhooksDisabledError,
  sso_required: SsoRequiredError,
  access_suspended: AccessSuspendedError,
  not_found: NotFoundError,
  conflict: ConflictError,
  idempotency_in_progress: IdempotencyInProgressError,
  replay: ReplayError,
  live_mode_only: LiveModeOnlyError,
  test_mode_only: TestModeOnlyError,
  test_mode_unsupported: TestModeUnsupportedError,
  gone: GoneError,
  idempotency_key_reused: IdempotencyKeyReusedError,
  payload_too_large: PayloadTooLargeError,
  connection_paused: ConnectionPausedError,
  rate_limited: RateLimitedError,
  internal_error: InternalServerError,
  atlas_error: AtlasError,
  sso_provider_error: SsoProviderError,
  sso_not_configured: SsoNotConfiguredError,
};
