import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { renderSnippetJs, type SnippetOptions } from '../src/served.js';

/** Runs the real served aff.js against a minimal fake browser. */
function browser(href: string, attrs: Record<string, string> = {}, opts: SnippetOptions = {}) {
  const store = new Map<string, string>();
  const cookieWrites: string[] = [];
  const cookies = new Map<string, string>();
  const sent: Array<{ url: string; body: any }> = [];
  const page = new URL(href);
  const document = {
    currentScript: { src: 'https://track.example.com/t/tk_1/aff.js', getAttribute: (n: string) => attrs[n] ?? null },
    get cookie() {
      return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
    },
    set cookie(v: string) {
      cookieWrites.push(v);
      const [pair, ...flags] = v.split('; ');
      const [k, val] = pair!.split('=');
      if (flags.includes('max-age=0')) cookies.delete(k!);
      else cookies.set(k!, val!);
    },
  };
  const window: Record<string, any> = { location: { href } };
  const ctx = {
    window,
    document,
    location: { protocol: page.protocol },
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
    },
    fetch: (url: string, init: { body: string }) => {
      sent.push({ url, body: JSON.parse(init.body) });
      return Promise.resolve();
    },
    URL,
    Date,
    Math,
    JSON,
    RegExp,
    parseInt,
    encodeURIComponent,
    decodeURIComponent,
  };
  const load = (url = href) => {
    window.location.href = url;
    runInNewContext(renderSnippetJs('tk_1', 'https://internal:4000', opts), ctx);
    return window.aff as { getReferral(): any; identify(o: object): void; forget(): void };
  };
  return { load, store, cookies, cookieWrites, sent };
}

describe('served aff.js', () => {
  it('posts to the origin it was loaded from, not the inlined base', () => {
    const b = browser('https://shop.example.com/?via=dana');
    b.load();
    expect(b.sent[0]!.url).toBe('https://track.example.com/t/tk_1/visit');
    expect(b.sent[0]!.body.code).toBe('dana');
  });

  it('marks the cookie Secure on https and uses the configured lifetime', () => {
    const b = browser('https://shop.example.com/?via=dana', {}, { cookieDays: 30 });
    b.load();
    expect(b.cookieWrites[0]).toContain('; Secure');
    expect(b.cookieWrites[0]).toContain(`max-age=${30 * 86400}`);
  });

  it('data-cookie-days overrides the default', () => {
    const b = browser('https://shop.example.com/?via=dana', { 'data-cookie-days': '7' }, { cookieDays: 90 });
    b.load();
    expect(b.cookieWrites[0]).toContain(`max-age=${7 * 86400}`);
  });

  it('referral-only mode stores and sends nothing for an unreferred visitor', () => {
    const b = browser('https://shop.example.com/pricing', { 'data-persist': 'referral-only' });
    b.load();
    expect(b.sent).toHaveLength(0);
    expect(b.store.size).toBe(0);
    expect(b.cookieWrites).toHaveLength(0);
  });

  it('referral-only mode still captures a referred visitor', () => {
    const b = browser('https://shop.example.com/?ref=dana', { 'data-persist': 'referral-only' });
    b.load();
    expect(b.sent).toHaveLength(1);
    // referalli_ctx and its legacy twin referally_ctx.
    expect(b.store.size).toBe(2);
    // A later unreferred page reads the context without sending or rewriting it.
    const aff = b.load('https://shop.example.com/signup');
    expect(aff.getReferral().code).toBe('dana');
    expect(b.sent).toHaveLength(1);
  });

  it('forget() deletes the stored context and stops sending', () => {
    const b = browser('https://shop.example.com/?via=dana');
    const aff = b.load();
    aff.forget();
    expect(b.store.size).toBe(0);
    expect(b.cookies.size).toBe(0);
    aff.identify({ customerRef: 'cus_1' });
    expect(b.sent).toHaveLength(1);
    expect(aff.getReferral().code).toBeNull();
  });

  it('data-cookie-domain shares the cookie with subdomains, and forget() clears it there too', () => {
    const b = browser('https://app.example.com/?via=dana', { 'data-cookie-domain': '.example.com' });
    const aff = b.load();
    expect(b.cookieWrites[0]).toContain('; domain=.example.com');
    aff.forget();
    expect(b.cookieWrites.at(-1)).toContain('max-age=0; SameSite=Lax; domain=.example.com');
  });

  it('ignores a malformed cookie domain', () => {
    const b = browser('https://app.example.com/?via=dana', { 'data-cookie-domain': 'x; path=/evil' });
    b.load();
    expect(b.cookieWrites[0]).not.toContain('domain=');
  });

  it("reads an imported tool's parameter, after the built-in ones", () => {
    const b = browser('https://shop.example.com/?fpr=kai', {}, { params: ['fpr', 'Bad-Name'] });
    expect(b.load().getReferral().code).toBe('kai');
    expect(b.sent[0]!.body.code).toBe('kai');
    // via still wins when both are present, and a malformed name is never read.
    const c = browser('https://shop.example.com/?fpr=kai&via=dana', {}, { params: ['fpr'] });
    expect(c.load().getReferral().code).toBe('dana');
    const d = browser('https://shop.example.com/?Bad-Name=x', {}, { params: ['Bad-Name'] });
    expect(d.load().getReferral().code).toBeNull();
  });

  it('last touch by default: a new code replaces the stored one', () => {
    const b = browser('https://shop.example.com/?via=first');
    b.load();
    expect(b.load('https://shop.example.com/?via=second').getReferral().code).toBe('second');
  });

  it('first touch keeps the first code when every program is first_click', () => {
    const b = browser('https://shop.example.com/?via=first', {}, { firstTouch: true });
    b.load();
    const aff = b.load('https://shop.example.com/?via=second');
    expect(aff.getReferral().code).toBe('first');
    expect(b.sent.at(-1)!.body.code).toBe('first');
  });

  it('first touch ends when the stored context expires', () => {
    const b = browser('https://shop.example.com/?via=first', {}, { firstTouch: true, cookieDays: 1 });
    b.load();
    const saved = JSON.parse(b.store.get('referalli_ctx')!);
    // Both names expire together (they are written as twins).
    for (const k of ['referalli_ctx', 'referally_ctx']) b.store.set(k, JSON.stringify({ ...saved, exp: Date.now() - 1 }));
    b.cookies.clear();
    expect(b.load('https://shop.example.com/?via=second').getReferral().code).toBe('second');
  });
});

describe('served aff.js: legacy referally_ctx twin', () => {
  it('writes referalli_ctx and referally_ctx with the same value, attributes and expiry', () => {
    const b = browser('https://shop.example.com/?via=dana', { 'data-cookie-domain': '.example.com' }, { cookieDays: 30 });
    b.load();
    const cur = b.cookieWrites.find((w) => w.startsWith('referalli_ctx='))!;
    const old = b.cookieWrites.find((w) => w.startsWith('referally_ctx='))!;
    expect(cur).toBeTruthy();
    expect(old).toBe(cur.replace(/^referalli_ctx=/, 'referally_ctx='));
    expect(cur).toContain(`max-age=${30 * 86400}`);
    expect(cur).toContain('domain=.example.com');
    expect(b.store.get('referally_ctx')).toBe(b.store.get('referalli_ctx'));
    expect(JSON.parse(b.store.get('referalli_ctx')!).code).toBe('dana');
  });

  it('reads a context saved only under the legacy name, and re-saves both', () => {
    const b = browser('https://shop.example.com/docs');
    b.cookies.set('referally_ctx', encodeURIComponent(JSON.stringify({ anonId: 'a_legacy', code: 'KAI', clickId: null, ts: 1 })));
    const aff = b.load();
    expect(aff.getReferral()).toMatchObject({ anonId: 'a_legacy', code: 'KAI' });
    expect(b.store.get('referalli_ctx')).toContain('a_legacy');
    expect(b.store.get('referally_ctx')).toContain('a_legacy');
  });

  it('forget() clears both names', () => {
    const b = browser('https://shop.example.com/?via=dana');
    b.load().forget();
    expect(b.store.has('referalli_ctx')).toBe(false);
    expect(b.store.has('referally_ctx')).toBe(false);
    expect(b.cookies.has('referalli_ctx')).toBe(false);
    expect(b.cookies.has('referally_ctx')).toBe(false);
  });

  it('does not list a name twice when the API also passes it as a legacy key', () => {
    const js = renderSnippetJs('tk_1', 'https://x', { legacyKeys: ['referally_ctx', 'old_ctx'] });
    expect(js).toContain('var KEYS=WKEYS.concat(["old_ctx"])');
  });
});
