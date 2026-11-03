'use client';

import { useState, type ReactNode } from 'react';
import { ReferralPanel, type ReferralPanelProps } from '@referalli/react';

/** Shows the server-rendered panel until the live widget is in the page, then swaps to it. */
export function LivePanelSwap({ children, ...panel }: Omit<ReferralPanelProps, 'onReady' | 'onError'> & { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <>
      {ready ? null : children}
      <ReferralPanel {...panel} onReady={() => setReady(true)} />
    </>
  );
}
