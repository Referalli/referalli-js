/**
 * `@referalli/react`: capture referrals, attribute signups and share links.
 *
 *   <ReferalliProvider publishableKey="tok_..." program="acme">
 *     <App />
 *   </ReferalliProvider>
 *
 * Only your public tracking token goes in the browser, never an `rk_` key.
 */
export {
  DEFAULT_BASE_URL,
  ReferalliProvider,
  useReferalli,
  useReferalliOptional,
  useReferral,
  useTrackSignup,
  type ReferalliProviderProps,
  type ReferralPartner,
  type ReferralState,
} from './provider.js';
export {
  PartnerSignup,
  ReferralLink,
  referralUrl,
  type PartnerSignupProps,
  type PartnerSignupState,
  type PublicProgram,
  type ReferralLinkProps,
  type ReferralLinkState,
} from './widgets.js';
export type { ReferralContext } from 'referalli/browser';
