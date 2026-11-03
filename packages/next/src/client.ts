'use client';

/**
 * `@referalli/next/client`: client components for Next.js.
 *
 *   import { ReferralPanel } from '@referalli/next/client';
 *   <ReferralPanel programId="prg_…" auth="atlas" />
 *
 * Inside `<ReferalliProvider publishableKey="tk_…">`, or pass `trackingToken`.
 */
export {
  ReferalliProvider,
  ReferralPanel,
  type GetAuthToken,
  type ReferalliProviderProps,
  type ReferralPanelProps,
  type ReferralWidgetAttributes,
  type ReferralWidgetElement,
} from '@referalli/react';
