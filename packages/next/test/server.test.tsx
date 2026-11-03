// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { Referalli } from 'referalli';
import { describe, expect, it } from 'vitest';
import { getReferralPanel, ReferralPanel } from '../src/server.js';

const me = {
  program: { id: 'prg_1', name: 'Acme' },
  partner: { displayName: 'Dana' },
  code: 'dana',
  coupon: null,
  link: 'https://referalli.com/go/tk_1/dana',
  share: null,
  progress: { clicks: 3, signups: 1, payingCustomers: 0 },
  earnings: [],
  refereeReward: null,
};

type Seen = { url: string; headers: Record<string, string>; body?: string };

function api(tokenStatus = 200) {
  const seen: Seen[] = [];
  const fetch = async (url: string, init: RequestInit) => {
    seen.push({ url, headers: init.headers as Record<string, string>, body: init.body as string | undefined });
    const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
    if (url.endsWith('/v1/widget/tokens')) {
      return tokenStatus === 200
        ? json(200, { token: 'wt_1', partnerId: 'par_1', expiresAt: '2026-11-03T10:15:00.000Z' })
        : json(tokenStatus, { error: { code: 'not_found', message: 'no partner' } });
    }
    return json(200, me);
  };
  return { client: new Referalli({ apiKey: 'rk_test', fetch, maxRetries: 0 }), seen };
}

describe('@referalli/next/server ReferralPanel', () => {
  it('reads the code and link with the API key, then the widget token', async () => {
    const { client, seen } = api();
    const data = await getReferralPanel({ client, programId: 'prg_1', customerRef: 'user_1', trackingToken: 'tk_1' });
    expect(data).toMatchObject({ code: 'dana', link: me.link, token: 'wt_1' });
    expect(seen[0]!.headers.authorization).toBe('Bearer rk_test');
    expect(JSON.parse(seen[0]!.body!)).toEqual({ programId: 'prg_1', customerRef: 'user_1' });
    expect(seen[1]!.url).toBe('https://referalli.com/t/tk_1/widget/me');
    expect(seen[1]!.headers.authorization).toBe('Widget wt_1');
  });

  it('renders the code and link on the server', async () => {
    const { client } = api();
    const html = renderToString(await ReferralPanel({ client, programId: 'prg_1', trackingToken: 'tk_1', getCustomerRef: async () => 'user_1' }));
    expect(html).toContain('data-referalli="referral-panel"');
    expect(html).toContain('<strong>dana</strong>');
    expect(html).toContain(`value="${me.link}"`);
  });

  it('renders nothing when signed out or not enrolled', async () => {
    const { client, seen } = api(404);
    expect(await ReferralPanel({ client, programId: 'prg_1', trackingToken: 'tk_1', customerRef: null })).toBeNull();
    expect(seen).toHaveLength(0);
    expect(await ReferralPanel({ client, programId: 'prg_1', trackingToken: 'tk_1', customerRef: 'user_1' })).toBeNull();
  });

  it('takes a render function', async () => {
    const { client } = api();
    const html = renderToString(await ReferralPanel({ client, programId: 'prg_1', trackingToken: 'tk_1', customerRef: 'user_1', children: (d) => <b>{d.progress.clicks}</b> }));
    expect(html).toBe('<b>3</b>');
  });

  it('with live, keeps the server markup for the first paint', async () => {
    const { client } = api();
    const html = renderToString(await ReferralPanel({ client, programId: 'prg_1', trackingToken: 'tk_1', customerRef: 'user_1', live: true }));
    expect(html).toContain('<strong>dana</strong>');
  });
});
