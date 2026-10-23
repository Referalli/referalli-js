/**
 * Verify Referalli webhook deliveries (Standard Webhooks: `webhook-id`,
 * `webhook-timestamp`, `webhook-signature: v1,<base64 HMAC-SHA256>`). Use the
 * raw request body exactly as received: re-serialized JSON won't match.
 *
 * `verifyWebhook` / `constructWebhookEvent` are synchronous (plain-JS HMAC, so
 * they run anywhere). `webhooks.verify` / `webhooks.constructEvent` are async
 * and use WebCrypto (falling back to `node:crypto` on Node 18).
 */
import { ReferalliError } from './errors.js';
import type { WebhookPayloads } from './generated.js';
import { hmacSha256 } from './sha256.js';

/** Deliveries signed more than this long ago (or ahead) are rejected. */
export const WEBHOOK_TOLERANCE_SEC = 300;

/** A plain header object (Node, Express) or a fetch `Headers` (Next.js, edge, Deno, Bun). */
export type WebhookHeaders = Record<string, string | string[] | undefined> | { get(name: string): string | null };

export interface VerifyOptions {
  /** Defaults to the current time. */
  now?: Date | number;
  /** Seconds; default 300. */
  toleranceSec?: number;
}

export type WebhookFailure = 'missing_headers' | 'timestamp' | 'signature';

export class WebhookVerificationError extends ReferalliError {
  override readonly name: string = 'WebhookVerificationError';

  constructor(
    message: string,
    readonly reason: WebhookFailure = 'signature',
  ) {
    super(message);
  }
}

/** Every delivery's envelope. `data` is the topic's payload. */
export interface WebhookEnvelope<Topic extends string = string, Data = Record<string, unknown>> {
  id: string;
  topic: Topic;
  orgId: string;
  livemode?: boolean;
  createdAt: string;
  data: Data;
}

type Topics = Extract<keyof WebhookPayloads, string>;
type EventFor<K extends Topics> = WebhookPayloads[K] extends { topic: unknown; data: unknown } ? WebhookPayloads[K] : WebhookEnvelope<K, WebhookPayloads[K]>;

/** A webhook topic (`referral.created`, …), from the OpenAPI document's `webhooks`. */
export type WebhookTopic = [Topics] extends [never] ? string : Topics;
/** Any delivery: a union discriminated by `topic`, so `switch (event.topic)` narrows `data`. */
export type WebhookEvent = [Topics] extends [never] ? WebhookEnvelope : { [K in Topics]: EventFor<K> }[Topics];
/** The delivery for one topic. */
export type WebhookEventOf<K extends WebhookTopic> = [Topics] extends [never] ? WebhookEnvelope<K> : Extract<WebhookEvent, { topic: K }>;

type RawBody = string | Uint8Array;

const enc = new TextEncoder();

function header(headers: WebhookHeaders, name: string): string | undefined {
  if (typeof (headers as { get?: unknown }).get === 'function') return (headers as { get(n: string): string | null }).get(name) ?? undefined;
  const h = headers as Record<string, string | string[] | undefined>;
  const v = h[name] ?? h[name.toLowerCase()] ?? Object.entries(h).find(([k]) => k.toLowerCase() === name)?.[1];
  return Array.isArray(v) ? v[0] : v;
}

function fromBase64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

/** The HMAC key a secret stands for: the base64 after `whsec_`, else the raw string. */
const keyOf = (secret: string): Uint8Array => (secret.startsWith('whsec_') ? fromBase64(secret.slice('whsec_'.length)) : enc.encode(secret));

function signedContent(id: string, ts: string, body: RawBody): Uint8Array {
  const prefix = enc.encode(`${id}.${ts}.`);
  const raw = typeof body === 'string' ? enc.encode(body) : body;
  const out = new Uint8Array(prefix.length + raw.length);
  out.set(prefix);
  out.set(raw, prefix.length);
  return out;
}

/** Constant-time string equality (length is not secret). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

interface Parsed {
  id: string;
  ts: string;
  provided: string[];
}

function parse(headers: WebhookHeaders, opts: VerifyOptions): Parsed | WebhookFailure {
  const id = header(headers, 'webhook-id');
  const ts = header(headers, 'webhook-timestamp');
  const sig = header(headers, 'webhook-signature');
  if (!id || !ts || !sig) return 'missing_headers';
  if (!/^\d+$/.test(ts)) return 'timestamp';
  const nowMs = opts.now === undefined ? Date.now() : typeof opts.now === 'number' ? opts.now : opts.now.getTime();
  if (Math.abs(nowMs / 1000 - Number(ts)) > (opts.toleranceSec ?? WEBHOOK_TOLERANCE_SEC)) return 'timestamp';
  return { id, ts, provided: sig.split(' ').filter((p) => p.startsWith('v1,')) };
}

const secretList = (secrets: string | string[]) => (Array.isArray(secrets) ? secrets : [secrets]);
const text = (body: RawBody) => (typeof body === 'string' ? body : new TextDecoder().decode(body));

const failureMessage: Record<WebhookFailure, string> = {
  missing_headers: 'missing webhook-id, webhook-timestamp or webhook-signature header',
  timestamp: 'webhook timestamp is outside the tolerance (replayed or clock skew)',
  signature: 'no webhook signature matches the secret',
};

function checkSync(rawBody: RawBody, headers: WebhookHeaders, secrets: string | string[], opts: VerifyOptions): WebhookFailure | null {
  const p = parse(headers, opts);
  if (typeof p === 'string') return p;
  const content = signedContent(p.id, p.ts, rawBody);
  const ok = secretList(secrets).some((secret) => {
    const expected = `v1,${toBase64(hmacSha256(keyOf(secret), content))}`;
    return p.provided.some((s) => safeEqual(s, expected));
  });
  return ok ? null : 'signature';
}

/**
 * True when `rawBody` was signed by Referalli with one of `secrets` within the
 * tolerance. Pass two secrets while you rotate one. Synchronous; runs anywhere.
 */
export function verifyWebhook(rawBody: RawBody, headers: WebhookHeaders, secrets: string | string[], opts: VerifyOptions = {}): boolean {
  return checkSync(rawBody, headers, secrets, opts) === null;
}

/** Verify, then parse the event. Throws `WebhookVerificationError` when the signature or timestamp is wrong. */
export function constructWebhookEvent<T = WebhookEvent>(rawBody: RawBody, headers: WebhookHeaders, secrets: string | string[], opts: VerifyOptions = {}): T {
  const failure = checkSync(rawBody, headers, secrets, opts);
  if (failure) throw new WebhookVerificationError(failureMessage[failure], failure);
  return JSON.parse(text(rawBody)) as T;
}

// Typed off the global so this compiles with DOM or Node typings.
type Subtle = typeof globalThis.crypto.subtle;
type Bytes = Parameters<Subtle['sign']>[2];

let subtlePromise: Promise<Subtle> | null = null;
/** WebCrypto: global on Node 19+, Bun, Deno, edge and browsers; `node:crypto` on Node 18. */
function subtle(): Promise<Subtle> {
  subtlePromise ??= (async () => {
    const c = (globalThis as { crypto?: { subtle?: Subtle } }).crypto;
    if (c?.subtle) return c.subtle;
    const mod = 'node:crypto';
    const nodeCrypto = (await import(/* webpackIgnore: true */ /* @vite-ignore */ mod)) as { webcrypto: { subtle: Subtle } };
    return nodeCrypto.webcrypto.subtle;
  })();
  return subtlePromise;
}

async function checkAsync(rawBody: RawBody, headers: WebhookHeaders, secrets: string | string[], opts: VerifyOptions): Promise<WebhookFailure | null> {
  const p = parse(headers, opts);
  if (typeof p === 'string') return p;
  const s = await subtle();
  const content = signedContent(p.id, p.ts, rawBody);
  for (const secret of secretList(secrets)) {
    const key = await s.importKey('raw', keyOf(secret) as Bytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const expected = `v1,${toBase64(new Uint8Array(await s.sign('HMAC', key, content as Bytes)))}`;
    if (p.provided.some((x) => safeEqual(x, expected))) return null;
  }
  return 'signature';
}

/** Async verification and typed event parsing (WebCrypto). Also available as `referalli.webhooks`. */
export const webhooks = {
  /** True when the delivery is authentic and fresh. */
  async verify(rawBody: RawBody, headers: WebhookHeaders, secrets: string | string[], opts: VerifyOptions = {}): Promise<boolean> {
    return (await checkAsync(rawBody, headers, secrets, opts)) === null;
  },

  /**
   * Verify the delivery and return the typed event; throws
   * `WebhookVerificationError` (with a `reason`) when it isn't authentic.
   *
   *   const event = await webhooks.constructEvent(await req.text(), req.headers, process.env.REFERALLI_WEBHOOK_SECRET!);
   *   if (event.topic === 'referral.created') event.data;
   */
  async constructEvent<T = WebhookEvent>(rawBody: RawBody, headers: WebhookHeaders, secrets: string | string[], opts: VerifyOptions = {}): Promise<T> {
    const failure = await checkAsync(rawBody, headers, secrets, opts);
    if (failure) throw new WebhookVerificationError(failureMessage[failure], failure);
    return JSON.parse(text(rawBody)) as T;
  },
};

export type Webhooks = typeof webhooks;
