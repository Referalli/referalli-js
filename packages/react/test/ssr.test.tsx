// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PartnerSignup, ReferalliProvider, ReferralLink, useReferral } from '../src/index.js';

function Probe() {
  const r = useReferral();
  return <span data-ready={String(r.ready)}>{r.code ?? 'none'}</span>;
}

describe('SSR', () => {
  it('renders on the server without touching window', () => {
    expect(typeof window).toBe('undefined');
    const html = renderToString(
      <ReferalliProvider publishableKey="tok_1" program="acme" initialReferral={{ anonId: 'a_1', code: 'DANA', clickId: null, ts: 1 }}>
        <Probe />
        <ReferralLink code="DANA" destination="https://shop.example/" />
        <PartnerSignup />
      </ReferalliProvider>,
    );
    expect(html).toContain('data-ready="false"');
    expect(html).toContain('DANA');
    expect(html).toContain('https://shop.example/?via=DANA');
    expect(html).toContain('href="https://referalli.com/join/acme"');
  });
});
