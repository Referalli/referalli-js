import { describe, expect, it } from 'vitest';
import { initSnippet, type SnippetEnv } from '../src/index.js';

/** Consent and lifetime options, matching the served aff.js. */
function fakeEnv(href: string) {
  const sent: Array<{ url: string; body: any }> = [];
  const cookies = new Map<string, string>();
  const store = new Map<string, string>();
  const writes: string[] = [];
  const env: SnippetEnv = {
    win: { location: { href } },
    doc: {
      get cookie() {
        return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
      },
      set cookie(v: string) {
        writes.push(v);
        const [pair] = v.split(';');
        const [k, val] = pair!.split('=');
        if (v.includes('max-age=0')) cookies.delete(k!.trim());
        else cookies.set(k!.trim(), val ?? '');
      },
    },
    storage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => void store.set(k, v),
      removeItem: (k) => void store.delete(k),
    },
    fetchFn: async (url, init) => {
      sent.push({ url, body: init.body ? JSON.parse(init.body) : null });
      return { ok: true };
    },
  };
  return { env, sent, cookies, store, writes };
}

const config = { token: 'tk_abc', baseUrl: 'https://t.merchant.com' };

describe('browser snippet options', () => {
  it('marks the cookie Secure on https and uses cookieDays', async () => {
    const f = fakeEnv('https://merchant.com/?via=dana');
    await initSnippet(f.env, { ...config, cookieDays: 30 });
    expect(f.writes[0]).toContain('; Secure');
    expect(f.writes[0]).toContain(`max-age=${30 * 86400}`);
  });

  it('no Secure flag on plain http', async () => {
    const f = fakeEnv('http://localhost:3000/?via=dana');
    await initSnippet(f.env, config);
    expect(f.writes[0]).not.toContain('Secure');
  });

  it('referral-only stores and sends nothing for an unreferred visitor', async () => {
    const f = fakeEnv('https://merchant.com/pricing');
    const aff = await initSnippet(f.env, { ...config, persist: 'referral-only' });
    expect(f.sent).toHaveLength(0);
    expect(f.store.size).toBe(0);
    expect(f.writes).toHaveLength(0);
    await aff.identify({ customerRef: 'cus_1' });
    expect(f.sent).toHaveLength(0);
  });

  it('referral-only still captures a referred visitor', async () => {
    const f = fakeEnv('https://merchant.com/?ref=dana');
    await initSnippet(f.env, { ...config, persist: 'referral-only' });
    expect(f.sent).toHaveLength(1);
    // referalli_ctx and its legacy twin referally_ctx.
    expect(f.store.size).toBe(2);
  });

  it('forget() deletes the context and stops sending', async () => {
    const f = fakeEnv('https://merchant.com/?via=dana');
    const aff = await initSnippet(f.env, config);
    aff.forget();
    expect(f.store.size).toBe(0);
    expect(f.cookies.size).toBe(0);
    await aff.identify({ customerRef: 'cus_1' });
    expect(f.sent).toHaveLength(1);
    expect(aff.getReferral().code).toBeNull();
  });

  it('first touch keeps the first code until it expires', async () => {
    const f = fakeEnv('https://merchant.com/?via=first');
    let now = 1_000_000;
    f.env.now = () => now;
    const opts = { ...config, firstTouch: true, cookieDays: 1 };
    await initSnippet(f.env, opts);
    f.env.win.location.href = 'https://merchant.com/?via=second';
    expect((await initSnippet(f.env, opts)).getReferral().code).toBe('first');
    now += 2 * 86_400_000;
    expect((await initSnippet(f.env, opts)).getReferral().code).toBe('second');
  });

  it('last touch by default', async () => {
    const f = fakeEnv('https://merchant.com/?via=first');
    await initSnippet(f.env, config);
    f.env.win.location.href = 'https://merchant.com/?via=second';
    expect((await initSnippet(f.env, config)).getReferral().code).toBe('second');
  });

  it('cookieDomain shares the cookie with subdomains', async () => {
    const f = fakeEnv('https://merchant.com/?via=dana');
    await initSnippet(f.env, { ...config, cookieDomain: '.merchant.com' });
    expect(f.writes[0]).toContain('; domain=.merchant.com');
  });
});
