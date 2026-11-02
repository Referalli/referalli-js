import { describe, expect, it } from 'vitest';
import { referalliAuthEvents, referralFromCookieHeader } from '../src/index.js';

const recorder = () => {
  const calls: Array<Record<string, unknown>> = [];
  return { calls, client: { associate: async (input: Record<string, unknown>) => void calls.push(input) } };
};

describe('referalliAuthEvents', () => {
  it('awaits an async getReferral (Next.js 15 headers())', async () => {
    const { calls, client } = recorder();
    const events = referalliAuthEvents(client, { programId: 'prg_1', getReferral: async () => ({ anonId: 'a_1' }) });
    await events.createUser({ user: { id: 'usr_1' } });
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({ programId: 'prg_1', customerRef: 'usr_1', anonId: 'a_1' });
  });

  it('still takes a sync getReferral', async () => {
    const { calls, client } = recorder();
    const events = referalliAuthEvents(client, { programId: 'prg_1', getReferral: () => ({ anonId: 'a_2' }) });
    await events.createUser({ user: { id: 'usr_2' } });
    expect(calls[0]).toMatchObject({ anonId: 'a_2' });
  });

  it('does nothing without a referral or an email', async () => {
    const { calls, client } = recorder();
    const events = referalliAuthEvents(client, { programId: 'prg_1', getReferral: async () => null });
    await events.createUser({ user: { id: 'usr_3' } });
    expect(calls).toHaveLength(0);
  });

  it('works with referralFromCookieHeader on either cookie name', async () => {
    const value = encodeURIComponent(JSON.stringify({ anonId: 'a_legacy' }));
    expect(referralFromCookieHeader(`referally_ctx=${value}`)?.anonId).toBe('a_legacy');
    const { calls, client } = recorder();
    const events = referalliAuthEvents(client, {
      programId: 'prg_1',
      getReferral: async () => referralFromCookieHeader(`other=1; referalli_ctx=${encodeURIComponent(JSON.stringify({ anonId: 'a_new' }))}`),
    });
    await events.createUser({ user: { id: 'usr_4' } });
    expect(calls[0]).toMatchObject({ anonId: 'a_new' });
  });
});
