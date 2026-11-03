/**
 * `@referalli/next/server`: the referral panel as a React Server Component.
 *
 *   import { ReferralPanel } from '@referalli/next/server';
 *   <ReferralPanel programId="prg_…" trackingToken="tk_…" customerRef={user.id} />
 *
 * It fetches the signed-in user's code and link on the server with your `rk_`
 * key (`REFERALLI_API_KEY`), so the page needs no `widget.js`. Only the copy
 * button is a client island.
 */
import type { ReactNode } from 'react';
import { ApiError, Referalli, type GetTOrgTokenWidgetMeResponse } from 'referalli';
import { ReferralLink } from '@referalli/react';
import { LivePanelSwap } from './live-panel.js';

/** The user's referral data (`GET /t/{tk}/widget/me`) plus the widget token it was read with. */
export type ReferralPanelData = GetTOrgTokenWidgetMeResponse & { token: string; expiresAt: string };

export interface GetReferralPanelInput {
  programId: string;
  /** The signed-in user, as you filed them with Referalli (associate's customerRef or the partner's externalRef). */
  customerRef: string;
  /** Your public tracking token (`tk_…`). */
  trackingToken: string;
  /** Enrolls the user on demand when the program's `settings.widget.autoEnroll` is on. */
  email?: string;
  displayName?: string;
  /** Widget token lifetime, 60–3600 s (matters only with `live`). Default 900. */
  ttlSeconds?: number;
  /** Default `new Referalli()` (reads `REFERALLI_API_KEY`). */
  client?: Referalli;
}

/**
 * The user's referral code, link, share links and progress, or `null` when
 * they are not a partner in the program (or no longer active). Server only.
 */
export async function getReferralPanel(input: GetReferralPanelInput): Promise<ReferralPanelData | null> {
  const client = input.client ?? new Referalli();
  try {
    const minted = await client.widget.tokens({
      programId: input.programId,
      customerRef: input.customerRef,
      ...(input.email ? { email: input.email } : {}),
      ...(input.displayName ? { displayName: input.displayName } : {}),
      ...(input.ttlSeconds ? { ttlSeconds: input.ttlSeconds } : {}),
    });
    const me = await client.request<GetTOrgTokenWidgetMeResponse>({
      method: 'GET',
      path: `/t/${encodeURIComponent(input.trackingToken)}/widget/me`,
      // The widget token, not the rk_ key: /t/* is the public tracking host.
      headers: { authorization: `Widget ${minted.token}` },
    });
    return { ...me, token: minted.token, expiresAt: minted.expiresAt };
  } catch (err) {
    // 404: not enrolled (autoEnroll off, or no email to enroll with); 401: the partner was banned or archived.
    if (err instanceof ApiError && (err.status === 404 || err.status === 401)) return null;
    throw err;
  }
}

export interface ReferralPanelProps extends Omit<GetReferralPanelInput, 'customerRef'> {
  /** The signed-in user's id. Or pass `getCustomerRef`. Neither, or an empty value, renders nothing. */
  customerRef?: string | null;
  /** Reads the user from your session, e.g. `async () => (await getSession())?.user.id`. */
  getCustomerRef?: () => string | null | undefined | Promise<string | null | undefined>;
  /** After hydration, swap to the live widget (`widget.js`: share buttons, progress, earnings). Default false. */
  live?: boolean;
  /** Defaults to `client.baseUrl`. */
  baseUrl?: string;
  lang?: string;
  className?: string;
  /** Apply the default look to the link and copy button. Default false (unstyled). */
  styled?: boolean;
  codeLabel?: ReactNode;
  copyLabel?: ReactNode;
  copiedLabel?: ReactNode;
  /** Render it yourself: `{(d) => <p>{d.code}</p>}`. */
  children?: (data: ReferralPanelData) => ReactNode;
}

/**
 * The signed-in customer's referral panel, rendered on the server: their code
 * and link with a copy button. Renders nothing when there is no user or they
 * are not enrolled.
 */
export async function ReferralPanel(props: ReferralPanelProps): Promise<ReactNode> {
  const customerRef = props.customerRef ?? (await props.getCustomerRef?.());
  if (!customerRef) return null;
  const client = props.client ?? new Referalli(props.baseUrl ? { baseUrl: props.baseUrl } : {});
  const data = await getReferralPanel({ ...props, customerRef, client });
  if (!data) return null;
  const panel = props.children ? (
    props.children(data)
  ) : (
    <div data-referalli="referral-panel" className={props.className}>
      {data.code ? (
        <p data-referalli="referral-code">
          {props.codeLabel ?? 'Your code'} <strong>{data.code}</strong>
        </p>
      ) : null}
      {data.link ? <ReferralLink url={data.link} styled={props.styled} copyLabel={props.copyLabel} copiedLabel={props.copiedLabel} /> : null}
    </div>
  );
  if (!props.live) return panel;
  return (
    <LivePanelSwap token={data.token} trackingToken={props.trackingToken} baseUrl={props.baseUrl ?? client.baseUrl} lang={props.lang} className={props.className}>
      {panel}
    </LivePanelSwap>
  );
}
