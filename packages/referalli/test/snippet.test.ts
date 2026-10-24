import { beforeEach, describe, expect, it } from 'vitest';
import { initSnippet, type SnippetEnv } from '../src/index.js';

interface Sent {
  url: string;
  body: any;
}

function fakeEnv(href: string): { env: SnippetEnv; sent: Sent[]; cookies: Map<string, string>; store: Map<string, string> } {
  const sent: Sent[] = [];
  const cookies = new Map<string, string>();
  const store = new Map<string, string>();
  let cookieStr = '';
  const rebuild = () => [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
  const env: SnippetEnv = {
    win: { location: { href } },
    doc: {
      get cookie() {
        return cookieStr;
      },
      set cookie(v: string) {
        const [pair] = v.split(';');
        const [k, val] = pair!.split('=');
        cookies.set(k!.trim(), val ?? '');
        cookieStr = rebuild();
      },
    },
    storage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => void store.set(k, v),
    },
    fetchFn: async (url, init) => {
      sent.push({ url, body: init.body ? JSON.parse(init.body) : null });
      return { ok: true };
    },
  };
  return { env, sent, cookies, store };
}

const config = { token: 'tk_abc', baseUrl: 'https://t.merchant.com' };

describe('browser snippet', () => {
  let ctx: ReturnType<typeof fakeEnv>;

  beforeEach(() => {
    ctx = fakeEnv('https://merchant.com/pricing?via=jamie&ref_click_id=clk_123');
  });

  it('captures params, persists context, and beacons a visit', async () => {
    const aff = await initSnippet(ctx.env, config);
    const ref = aff.getReferral();
    expect(ref.code).toBe('jamie');
    expect(ref.clickId).toBe('clk_123');
    expect(ref.anonId).toMatch(/^a_/);

    expect(ctx.sent).toHaveLength(1);
    expect(ctx.sent[0]!.url).toBe('https://t.merchant.com/t/tk_abc/visit');
    expect(ctx.sent[0]!.body).toMatchObject({ anonId: ref.anonId, code: 'jamie', clickId: 'clk_123' });

    expect(ctx.store.get('referalli_ctx')).toContain('jamie');
    expect(ctx.cookies.get('referalli_ctx')).toBeTruthy();
  });

  it('reuses the anon id on later loads without params', async () => {
    const first = await initSnippet(ctx.env, config);
    const anonId = first.getReferral().anonId;

    ctx.env.win.location.href = 'https://merchant.com/docs';
    const second = await initSnippet(ctx.env, config);
    expect(second.getReferral().anonId).toBe(anonId);
    expect(second.getReferral().code).toBe('jamie'); // context survives navigation
    expect(ctx.sent).toHaveLength(2);
  });

  it('recovers context from cookie when storage is wiped', async () => {
    const first = await initSnippet(ctx.env, config);
    const anonId = first.getReferral().anonId;
    ctx.store.clear();
    ctx.env.win.location.href = 'https://merchant.com/';
    const second = await initSnippet(ctx.env, config);
    expect(second.getReferral().anonId).toBe(anonId);
  });

  it('still beacons with a fresh anon id when all storage is gone', async () => {
    ctx.env.storage = null;
    const noCookieEnv = { ...ctx.env, doc: { cookie: '' } } as SnippetEnv;
    Object.defineProperty(noCookieEnv.doc, 'cookie', { get: () => '', set: () => {} });
    const aff = await initSnippet(noCookieEnv, config);
    expect(aff.getReferral().anonId).toMatch(/^a_/);
    expect(ctx.sent).toHaveLength(1);
  });

  it('identify posts customer ref and email hash', async () => {
    const aff = await initSnippet(ctx.env, config);
    await aff.identify({ customerRef: 'cus_1', emailHash: 'h1' });
    expect(ctx.sent).toHaveLength(2);
    expect(ctx.sent[1]!.url).toBe('https://t.merchant.com/t/tk_abc/identify');
    expect(ctx.sent[1]!.body).toMatchObject({ customerRef: 'cus_1', emailHash: 'h1' });
  });
});

describe('legacy storage keys', () => {
  it('reads a context saved under an older key and re-saves it under the current one', async () => {
    const store = new Map<string, string>([['old_ctx', JSON.stringify({ anonId: 'a_old', code: 'DANA', clickId: null, ts: 1 })]]);
    const doc = { cookie: '' };
    const aff = await initSnippet(
      {
        win: { location: { href: 'https://shop.example/' } },
        doc,
        storage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => void store.set(k, v) },
        fetchFn: async () => ({}),
      },
      { token: 'tok', baseUrl: 'https://referalli.com', legacyKeys: ['old_ctx'] },
    );
    expect(aff.getReferral()).toMatchObject({ anonId: 'a_old', code: 'DANA' });
    expect(store.get('referalli_ctx')).toContain('a_old');
  });
});

describe('legacy referally_ctx twin', () => {
  it('writes both names with the same value, attributes and expiry', async () => {
    const writes: string[] = [];
    const store = new Map<string, string>();
    await initSnippet(
      {
        win: { location: { href: 'https://shop.example/?via=dana' } },
        doc: {
          get cookie() {
            return '';
          },
          set cookie(v: string) {
            writes.push(v);
          },
        },
        storage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => void store.set(k, v) },
        fetchFn: async () => ({}),
      },
      { token: 'tok', baseUrl: 'https://referalli.com', cookieDays: 14, cookieDomain: '.shop.example' },
    );
    const cur = writes.find((w) => w.startsWith('referalli_ctx='))!;
    const old = writes.find((w) => w.startsWith('referally_ctx='))!;
    expect(old).toBe(cur.replace(/^referalli_ctx=/, 'referally_ctx='));
    expect(cur).toContain(`max-age=${14 * 86_400}`);
    expect(cur).toContain('domain=.shop.example');
    expect(store.get('referally_ctx')).toBe(store.get('referalli_ctx'));
  });

  it('reads a context saved only under referally_ctx without being told the legacy key', async () => {
    const store = new Map<string, string>([['referally_ctx', JSON.stringify({ anonId: 'a_old', code: 'KAI', clickId: null, ts: 1 })]]);
    const aff = await initSnippet(
      {
        win: { location: { href: 'https://shop.example/' } },
        doc: { cookie: '' },
        storage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => void store.set(k, v) },
        fetchFn: async () => ({}),
      },
      { token: 'tok', baseUrl: 'https://referalli.com' },
    );
    expect(aff.getReferral()).toMatchObject({ anonId: 'a_old', code: 'KAI' });
    expect(store.get('referalli_ctx')).toContain('a_old');
  });

  it('referralFromCookieHeader reads either name, the current one first', async () => {
    const { referralFromCookieHeader } = await import('../src/attribution.js');
    const enc = (o: object) => encodeURIComponent(JSON.stringify(o));
    expect(referralFromCookieHeader(`referally_ctx=${enc({ anonId: 'a_1', code: 'OLD', ts: 1 })}`)?.code).toBe('OLD');
    expect(
      referralFromCookieHeader(`referally_ctx=${enc({ anonId: 'a_1', code: 'OLD', ts: 1 })}; referalli_ctx=${enc({ anonId: 'a_1', code: 'NEW', ts: 1 })}`)?.code,
    ).toBe('NEW');
  });
});
