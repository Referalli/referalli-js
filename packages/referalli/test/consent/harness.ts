import { runInNewContext } from 'node:vm';
import { initSnippet } from '../../src/snippet.js';
import { renderSnippetJs, type SnippetOptions } from '../../src/served.js';
import type { ConsentOptions } from '../../src/consent/port.js';

/** A minimal browser window: events, timers (vitest's, fake or real), a cookie jar and localStorage. */
export interface FakeWindow extends Record<string, any> {
  location: { href: string; protocol: string };
  document: FakeDocument;
  localStorage: { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void };
  dispatch(name: string, detail?: unknown): void;
}

export interface FakeDocument {
  cookie: string;
  currentScript: { src: string; getAttribute(n: string): string | null } | null;
  visibilityState: 'visible' | 'hidden';
  getElementById(id: string): unknown;
  scripts: Record<string, unknown>;
}

export interface Page {
  w: FakeWindow;
  cookies: Map<string, string>;
  store: Map<string, string>;
  sent: Array<{ url: string; body: any }>;
  aff: any;
}

export function fakeWindow(href: string, attrs: Record<string, string> = {}): Omit<Page, 'aff'> {
  const cookies = new Map<string, string>();
  const store = new Map<string, string>();
  const sent: Array<{ url: string; body: any }> = [];
  const listeners = new Map<string, Set<(e: unknown) => void>>();
  const scripts: Record<string, unknown> = {};
  const url = new URL(href);
  const document: FakeDocument = {
    get cookie() {
      return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
    },
    set cookie(v: string) {
      const [pair, ...flags] = v.split('; ');
      const i = pair!.indexOf('=');
      const k = pair!.slice(0, i);
      if (flags.includes('max-age=0')) cookies.delete(k);
      else cookies.set(k, pair!.slice(i + 1));
    },
    currentScript: { src: 'https://track.example.com/t/tk_1/aff.js', getAttribute: (n) => attrs[n] ?? null },
    visibilityState: 'visible',
    getElementById: (id) => scripts[id] ?? null,
    scripts,
  };
  const w: FakeWindow = {
    location: { href, protocol: url.protocol },
    document,
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => void store.set(k, v),
      removeItem: (k) => void store.delete(k),
    },
    addEventListener(name: string, fn: (e: unknown) => void) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name)!.add(fn);
    },
    removeEventListener(name: string, fn: (e: unknown) => void) {
      listeners.get(name)?.delete(fn);
    },
    dispatch(name: string, detail?: unknown) {
      for (const fn of [...(listeners.get(name) ?? [])]) fn({ type: name, detail });
    },
    // Resolved at call time, so vitest's fake timers apply.
    setTimeout: (fn: () => void, ms?: number) => setTimeout(fn, ms),
    clearTimeout: (t: ReturnType<typeof setTimeout>) => clearTimeout(t),
    setInterval: (fn: () => void, ms?: number) => setInterval(fn, ms),
    clearInterval: (t: ReturnType<typeof setInterval>) => clearInterval(t),
  };
  const fetch = (u: string, init: { body: string }) => {
    sent.push({ url: u, body: JSON.parse(init.body) });
    return Promise.resolve({});
  };
  (w as any).fetch = fetch;
  return { w, cookies, store, sent };
}

/** The real served aff.js, run in a fresh VM context against the fake window. */
export function servedPage(
  page: Omit<Page, 'aff'>,
  attrs: Record<string, string> = {},
  opts: SnippetOptions = {},
): Page {
  const { w } = page;
  w.document.currentScript = { src: 'https://track.example.com/t/tk_1/aff.js', getAttribute: (n) => attrs[n] ?? null };
  const ctx = {
    window: w,
    document: w.document,
    location: { protocol: w.location.protocol },
    localStorage: w.localStorage,
    fetch: w.fetch,
    URL,
    Date,
    Math,
    JSON,
    RegExp,
    parseInt,
    encodeURIComponent,
    decodeURIComponent,
  };
  runInNewContext(renderSnippetJs('tk_1', 'https://internal:4000', opts), ctx);
  return { ...page, aff: w.aff };
}

/** `referalli/browser`'s engine (initSnippet) against the same fake window. */
export async function modulePage(page: Omit<Page, 'aff'>, consent: ConsentOptions): Promise<Page> {
  const { w } = page;
  const aff = await initSnippet(
    {
      win: w,
      doc: w.document,
      storage: w.localStorage,
      fetchFn: (u, init) => w.fetch(u, init),
      consentWindow: w,
    },
    { token: 'tk_1', baseUrl: 'https://track.example.com', consent },
  );
  return { ...page, aff };
}

export type Runtime = 'served' | 'module';

/** Load the tracker in either runtime with a consent mode. */
export async function load(runtime: Runtime, page: Omit<Page, 'aff'>, consent: ConsentOptions & object): Promise<Page> {
  if (runtime === 'module') return modulePage(page, consent);
  return servedPage(page, {}, { consent });
}

export const visits = (p: Page) => p.sent.filter((s) => s.url.endsWith('/visit'));
export const stored = (p: Page) => p.cookies.has('referalli_ctx') || p.store.has('referalli_ctx') || p.cookies.has('referally_ctx');
