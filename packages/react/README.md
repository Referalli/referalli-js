# @referalli/react

React components and hooks for [Referalli](https://referalli.com). They capture referrals, attribute signups and let partners share their links. The components are SSR-safe, so they work in the Next.js App Router, Remix and Vite apps. They are unstyled by default, with an optional built-in style.

```sh
npm install @referalli/react
```

```tsx
import { ReferalliProvider } from '@referalli/react';

export default function App({ children }) {
  return (
    <ReferalliProvider publishableKey="tok_..." program="acme">
      {children}
    </ReferalliProvider>
  );
}
```

`publishableKey` is your org's public tracking token. Only this token goes in the browser, never an `rk_` key. The provider records the visit and keeps the referral (`?via=`, `?ref=`, `?aff=`, `ref_click_id`) in a first-party cookie on your domain. Nothing touches `window` until the component mounts.

| Prop | |
|---|---|
| `publishableKey` | Your public tracking token (required). |
| `program` | A program handle, used by `<PartnerSignup>`. |
| `baseUrl` | Default `https://referalli.com`. |
| `track` | Default `true`. Set it to `false` until the visitor gives consent. |
| `resolvePartner` | Default `true`. Looks up the partner's first name, for example "Invited by Dana". |
| `initialReferral` | A referral read on the server (`getReferral()` from `@referalli/next`), so the page can render it before hydration. |
| `persist`, `cookieDays`, `firstTouch`, `cookieDomain`, `params` | Tracker options. |

## Hooks

```tsx
import { useReferral, useTrackSignup } from '@referalli/react';

function InviteBanner() {
  const { code, partner, ready } = useReferral();
  if (!ready || !code) return null;
  return <p>Invited by {partner?.partnerDisplayName ?? 'a friend'}</p>;
}

function SignupForm() {
  const trackSignup = useTrackSignup();
  async function onSubmit(form) {
    const user = await createAccount(form);
    await trackSignup({ customerRef: user.id, email: user.email }); // never throws
  }
  // ...
}
```

`trackSignup` hashes the email in the browser before sending it. For attribution you can rely on, also call `associate` from your server (see `@referalli/next` or `@referalli/express`).

## Components

```tsx
import { PartnerSignup, ReferralLink } from '@referalli/react';

<ReferralLink url={link.shortUrl} styled />
<ReferralLink code="DANA" destination="https://example.com/pricing" />
<ReferralLink code="DANA">{({ url, copy, copied }) => <button onClick={copy}>{copied ? 'Copied!' : url}</button>}</ReferralLink>

<PartnerSignup handle="acme" styled />
<PartnerSignup>{({ program, joinUrl }) => <a href={joinUrl}>Join {program?.programName}</a>}</PartnerSignup>
```

By default the components are unstyled. Each element has a `data-referalli` attribute (`referral-link`, `referral-link-copy`, `partner-signup-cta`, …) that you can target with CSS. Pass `styled` to use the built-in look, which you can theme with the CSS variables `--referalli-accent`, `--referalli-radius`, `--referalli-border` and `--referalli-font`.

`<PartnerSignup>` shows a program's public pitch and links to the hosted partner signup page, where the partner creates an account and gets their link.

## License

MIT
