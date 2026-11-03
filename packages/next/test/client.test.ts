import { describe, expect, it } from 'vitest';
import * as react from '@referalli/react';
import { ReferalliProvider, ReferralPanel } from '../src/client.js';

describe('@referalli/next/client', () => {
  it('re-exports the React client components', () => {
    expect(ReferralPanel).toBe(react.ReferralPanel);
    expect(ReferalliProvider).toBe(react.ReferalliProvider);
  });
});
