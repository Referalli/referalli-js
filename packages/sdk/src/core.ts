import { ReferalliError } from './errors.js';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** One operation in the generated table. */
export interface OperationSpec {
  method: HttpMethod;
  path: string;
  pathParams: readonly string[];
  /** Query parameters, by wire name. */
  query: readonly string[];
  body: boolean;
  kind: 'json' | 'list' | 'text' | 'empty';
  /** Callable without an API key. */
  public?: boolean;
}

/** Per-request overrides. */
export interface RequestOptions {
  /**
   * Sent as `Idempotency-Key`. Every POST gets a generated one when you don't
   * pass it, and the same key is reused on every retry.
   */
  idempotencyKey?: string;
  /** Milliseconds before the request is abandoned (and retried, if it can be). */
  timeout?: number;
  maxRetries?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  /** Override the `referalli-version` for this request (`null` sends none). */
  apiVersion?: string | null;
}

/** Query values the SDK can encode. Arrays repeat the key; dates are ISO 8601. */
export type QueryValue = string | number | boolean | Date | null | undefined | ReadonlyArray<string | number | boolean>;

export interface OperationInput {
  path?: Record<string, string>;
  query?: object;
  body?: unknown;
}

/** Cursor paging params every list operation accepts. */
export interface PageParams {
  /** 1–100 items per page. */
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  'created[gte]'?: string;
  'created[lte]'?: string;
}

/** The list envelope (referalli-version 2026-11-01 and later). */
export interface ListEnvelope<T> {
  object: 'list';
  data: T[];
  has_more: boolean;
  next_cursor: string | null;
}

/** What the generated resources call into (the client implements it). */
export interface Transport {
  op<R>(id: string, input: OperationInput, options?: RequestOptions): Promise<R>;
  list<Item, Page extends ListEnvelope<Item>>(id: string, input: OperationInput, options?: RequestOptions): ListPromise<Item, Page>;
}

/**
 * A list call. Await it for the first page, or iterate it with `for await`
 * to get every item, fetching further pages (`starting_after`) as you go.
 * Nothing is requested until you do one or the other.
 */
export class ListPromise<Item, Page extends ListEnvelope<Item> = ListEnvelope<Item>> implements PromiseLike<Page>, AsyncIterable<Item> {
  private first: Promise<Page> | null = null;

  constructor(private readonly fetchPage: (cursor: string | undefined) => Promise<Page>) {}

  private firstPage(): Promise<Page> {
    this.first ??= this.fetchPage(undefined).then(checkPage);
    return this.first;
  }

  then<A = Page, B = never>(onfulfilled?: ((page: Page) => A | PromiseLike<A>) | null, onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null): Promise<A | B> {
    return this.firstPage().then(onfulfilled, onrejected);
  }

  catch<B = never>(onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null): Promise<Page | B> {
    return this.firstPage().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<Page> {
    return this.firstPage().finally(onfinally);
  }

  /** Every page, starting with the first. */
  async *pages(): AsyncGenerator<Page, void, undefined> {
    let page = await this.firstPage();
    for (;;) {
      yield page;
      if (!page.has_more || !page.next_cursor) return;
      page = checkPage(await this.fetchPage(page.next_cursor));
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Item, void, undefined> {
    for await (const page of this.pages()) yield* page.data;
  }

  /** Collect items into an array, stopping at `limit` (default 10,000) so a runaway list can't exhaust memory. */
  async toArray(opts: { limit?: number } = {}): Promise<Item[]> {
    const limit = opts.limit ?? 10_000;
    const out: Item[] = [];
    if (limit <= 0) return out;
    for await (const item of this) {
      out.push(item);
      if (out.length >= limit) break;
    }
    return out;
  }
}

function checkPage<P>(page: P): P {
  const p = page as unknown as ListEnvelope<unknown> | null;
  if (!p || typeof p !== 'object' || !Array.isArray(p.data)) {
    throw new ReferalliError('the API did not return a list page: send referalli-version 2026-11-01 or later (the SDK default)');
  }
  return page;
}
