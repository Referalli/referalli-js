import { describe, expect, it } from 'vitest';
import { createMobileClient } from '../src/index.js';

/** `@referalli/react-native` builds on this exact shape; keep it stable. */
describe('createMobileClient', () => {
  it('resolves deferred links and attributes installs under /t/{token}/mobile', async () => {
    const calls: Array<[string, RequestInit | undefined]> = [];
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      calls.push([url, init]);
      return new Response(JSON.stringify(url.endsWith('/resolve') ? { matched: true, clickId: 'clk_1' } : { attributed: true, referralId: 'ref_1', partnerId: 'ptr_1' }));
    }) as typeof fetch;
    const m = createMobileClient({ endpoint: 'https://referalli.com', trackingToken: 'tok_1', programId: 'prg_1', fetchImpl });
    expect(await m.resolveDeferred()).toEqual({ matched: true, clickId: 'clk_1' });
    expect(await m.attributeInstall('usr_1', 'clk_1', 'dev_1')).toMatchObject({ attributed: true });
    expect(calls[0]![0]).toBe('https://referalli.com/t/tok_1/mobile/resolve');
    expect(calls[1]![0]).toBe('https://referalli.com/t/tok_1/mobile/install');
    expect(JSON.parse(String(calls[1]![1]!.body))).toEqual({ programId: 'prg_1', customerRef: 'usr_1', clickId: 'clk_1', deviceId: 'dev_1' });
  });
});
