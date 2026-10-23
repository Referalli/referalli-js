/** Base class for every error this SDK throws. */
export class ReferalliError extends Error {
  override readonly name: string = 'ReferalliError';
}

/** The API could not be reached (network failure), after any retries. */
export class ApiConnectionError extends ReferalliError {
  override readonly name: string = 'ApiConnectionError';

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}

/** The request took longer than `timeout`, after any retries. */
export class ApiTimeoutError extends ApiConnectionError {
  override readonly name: string = 'ApiTimeoutError';
}

export interface ApiErrorInit {
  status: number;
  code: string;
  message: string;
  requestId?: string | null;
  docsUrl?: string | null;
  details?: unknown;
  /** Seconds the API asked us to wait (`Retry-After`), if it said. */
  retryAfter?: number | null;
  headers?: Record<string, string>;
}

/**
 * The API answered with an error. `code` is stable (see
 * https://referalli.com/docs/errors-and-limits); each code has its own
 * subclass (`NotFoundError`, `RateLimitedError`, …) so you can `instanceof`.
 */
export class ApiError extends ReferalliError {
  override readonly name: string = 'ApiError';
  readonly status: number;
  readonly code: string;
  readonly requestId: string | null;
  readonly docsUrl: string | null;
  readonly details: unknown;
  readonly retryAfter: number | null;
  readonly headers: Record<string, string>;

  constructor(init: ApiErrorInit) {
    super(`${init.code} (${init.status}): ${init.message}`);
    this.status = init.status;
    this.code = init.code;
    this.requestId = init.requestId ?? null;
    this.docsUrl = init.docsUrl ?? null;
    this.details = init.details;
    this.retryAfter = init.retryAfter ?? null;
    this.headers = init.headers ?? {};
  }
}
