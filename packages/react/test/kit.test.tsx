import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createHash } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PartnerSignup, ReferalliProvider, ReferralLink, useReferral, useTrackSignup } from '../src/index.js';

type Call = { url: string; body: Record<string, unknown> | null };
let calls: Call[] = [];

beforeEach(() => {
  calls = [];
  document.cookie = 'referalli_ctx=; path=/; max-age=0';
  window.localStorage.clear();
  window.history.replaceState({}, '', '/pricing?via=DANA');
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, body: init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : null });
      if (url.includes('/codes/DANA')) {
        return new Response(JSON.stringify({ valid: true, partnerDisplayName: 'Dana', refereeReward: null }), { status: 200 });
      }
      if (url.includes('/v1/public/programs/acme')) {
        return new Response(JSON.stringify({ handle: 'acme', programName: 'Acme Partners', pitch: 'Earn 20% forever', merchant: 'Acme' }), { status: 200 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function Probe() {
  const r = useReferral();
  const trackSignup = useTrackSignup();
  return (
    <div>
      <span data-testid="code">{r.code ?? 'none'}</span>
      <span data-testid="partner">{r.partner?.partnerDisplayName ?? '-'}</span>
      <span data-testid="ready">{String(r.ready)}</span>
      <button onClick={() => void trackSignup({ customerRef: 'usr_1', email: ' Dana@Example.com ' })}>signup</button>
    </div>
  );
}

describe('ReferalliProvider + hooks', () => {
  it('captures ?via= into the first-party cookie, records the visit and resolves the partner', async () => {
    render(
      <ReferalliProvider publishableKey="tok_1" baseUrl="https://track.example">
        <Probe />
      </ReferalliProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('code').textContent).toBe('DANA'));
    await waitFor(() => expect(screen.getByTestId('partner').textContent).toBe('Dana'));
    expect(screen.getByTestId('ready').textContent).toBe('true');
    expect(document.cookie).toContain('referalli_ctx=');
    const visit = calls.find((c) => c.url === 'https://track.example/t/tok_1/visit');
    expect(visit?.body).toMatchObject({ code: 'DANA' });
    expect(String(visit?.body?.anonId)).toMatch(/^a_/);
  });

  it('useTrackSignup identifies the visitor with a hashed email', async () => {
    render(
      <ReferalliProvider publishableKey="tok_1">
        <Probe />
      </ReferalliProvider>,
    );
    await act(async () => {
      fireEvent.click(screen.getByText('signup'));
    });
    await waitFor(() => expect(calls.some((c) => c.url.endsWith('/t/tok_1/identify'))).toBe(true));
    const identify = calls.find((c) => c.url.endsWith('/t/tok_1/identify'))!;
    expect(identify.url).toBe('https://referalli.com/t/tok_1/identify');
    expect(identify.body).toMatchObject({
      customerRef: 'usr_1',
      emailHash: createHash('sha256').update('dana@example.com').digest('hex'),
    });
  });

  it('track={false} sends nothing (before consent)', async () => {
    render(
      <ReferalliProvider publishableKey="tok_1" track={false} resolvePartner={false}>
        <Probe />
      </ReferalliProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('ready').textContent).toBe('true'));
    expect(calls).toEqual([]);
  });
});

describe('ReferralLink', () => {
  it('copies the link and shows feedback', async () => {
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<ReferralLink code="DANA" destination="https://shop.example/pricing" />);
    expect((screen.getByLabelText('Referral link') as HTMLInputElement).value).toBe('https://shop.example/pricing?via=DANA');
    await act(async () => {
      fireEvent.click(screen.getByText('Copy'));
    });
    expect(writeText).toHaveBeenCalledWith('https://shop.example/pricing?via=DANA');
    expect(screen.getByText('Copied')).toBeTruthy();
  });

  it('defaults a code link to this site and supports a render prop', async () => {
    render(<ReferralLink code="KAI">{(s) => <a href={s.url}>share</a>}</ReferralLink>);
    await waitFor(() => expect(screen.getByText('share').getAttribute('href')).toBe(`${window.location.origin}/?via=KAI`));
  });
});

describe('PartnerSignup', () => {
  it("shows the program's pitch and links to its hosted sign-up", async () => {
    render(
      <ReferalliProvider publishableKey="tok_1" program="acme" track={false} resolvePartner={false}>
        <PartnerSignup styled />
      </ReferalliProvider>,
    );
    await waitFor(() => expect(screen.getByText('Acme Partners')).toBeTruthy());
    expect(screen.getByText('Earn 20% forever')).toBeTruthy();
    expect(screen.getByText('Become a partner').getAttribute('href')).toBe('https://referalli.com/join/acme');
  });
});
