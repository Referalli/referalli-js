import { describe, expect, it } from 'vitest';
import { ReferalliClient, SDK_API_VERSION } from '../src/index.js';

/** The list iterator follows next_cursor until has_more is false. */
describe('ReferalliClient.list', () => {
  it('walks every page and sends the version header', async () => {
    const items = Array.from({ length: 5 }, (_, i) => ({ id: `ref_${i}` }));
    const seen: Array<{ url: string; version: string | undefined }> = [];
    const fetchFn = async (url: string, init: RequestInit) => {
      const u = new URL(url);
      seen.push({ url: u.pathname + u.search, version: (init.headers as Record<string, string>)['referalli-version'] });
      const after = u.searchParams.get('starting_after');
      const start = after ? items.findIndex((x) => x.id === after) + 1 : 0;
      expect(u.searchParams.get('limit')).toBe('100');
      const data = items.slice(start, start + 2);
      const more = start + 2 < items.length;
      return new Response(JSON.stringify({ object: 'list', data, has_more: more, next_cursor: more ? data[data.length - 1]!.id : null }));
    };
    const client = new ReferalliClient({ apiKey: 'rk_x', baseUrl: 'https://api.example.com', fetchFn });
    const out: string[] = [];
    for await (const r of client.list<{ id: string }>('/v1/referrals', { status: 'active' })) out.push(r.id);
    expect(out).toEqual(items.map((x) => x.id));
    expect(seen).toHaveLength(3);
    expect(seen[1]!.url).toContain('starting_after=ref_1');
    expect(seen[0]!.url).toContain('status=active');
    expect(seen.every((s) => s.version === SDK_API_VERSION)).toBe(true);
  });

  it('explains a legacy-version response', async () => {
    const fetchFn = async () => new Response(JSON.stringify([{ id: 'a' }]));
    const client = new ReferalliClient({ apiKey: 'rk_x', baseUrl: 'https://x', fetchFn, apiVersion: null });
    await expect(client.list('/v1/referrals').next()).rejects.toThrow(/list page/);
  });
});
