# @referalli/next

Next.js support for [Referalli](https://referalli.com):

- Middleware that saves `?ref=` into a first-party cookie on your domain, once the visitor consents
- `getReferral()` for server components, route handlers and server actions
- Signup attribution
- Webhook route handlers

```sh
npm install @referalli/next referalli
```

## Middleware

```ts
// middleware.ts
import { referalliMiddleware } from '@referalli/next/middleware';
export const middleware = referalliMiddleware({ consent: 'cookiemunch' });
export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] };
```

**Without a `consent` option the middleware sets the cookie with no consent check.** Use that only where no opt-in is needed. In the EU and UK, set `consent` (see [Consent](#consent)).

If a request URL carries `?via=`, `?ref=`, `?aff=` or `ref_click_id` and the visitor has consented, the middleware sets the referral cookie. It is not HttpOnly, so the browser tracker shares it. You can pass options, or add it to a middleware you already have:

```ts
import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';
import { captureReferral } from '@referalli/next/middleware';

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const res = NextResponse.next();
  return captureReferral(req, res, { cookieDomain: '.example.com', publishableKey: 'tk_...' }, event);
}
```

With `publishableKey` set, the middleware also records the landing on the server. The landing then counts even on pages that never load the browser tracker. The middleware only imports edge-safe code.

## Consent

The referral cookie is a marketing cookie. The `consent` option decides when the middleware may set it:

| `consent` | Reads |
| --- | --- |
| not set (default) | Nothing. Always granted, so the cookie is set before any banner decision. |
| `'cookiemunch'` | Cookie Munch's `CookieMunch` cookie, category `referrals`, falling back to `marketing` when your site has no `referrals` category. This is the same rule aff.js uses with `data-consent="cookiemunch"`. |
| `{ cookiemunch: { category: 'affiliates' } }` | The same, for a category you name. There is no fallback. |
| `(req) => 'granted' \| 'denied' \| 'unknown'` | Your own CMP's cookie. |

- **No decision yet** (`unknown`, for example no `CookieMunch` cookie): no cookie is set. With the Cookie Munch reader and `publishableKey`, the landing is still recorded, marked `unknown`, so it counts either way. The function form sends nothing until a decision.
- **Granted:** the cookie is set. The landing is recorded with the consent evidence, including Cookie Munch's consent stamp.
- **Denied:** an existing referral cookie is deleted, and nothing is sent.

## Reading the referral on the server

```tsx
import { getReferral } from '@referalli/next';

export default async function Page() {
  const referral = await getReferral(); // { anonId, code, clickId, ts } | null
  return referral?.code ? <p>You were invited!</p> : null;
}
```

To render the referral before the client reads the cookie, pass it to `<ReferalliProvider initialReferral={referral}>` from `@referalli/react`. In Pages Router API routes, use `getReferralFromRequest(req)`.

## Attribute a signup (server action)

```ts
'use server';
import { Referalli } from 'referalli';
import { attributeSignup } from '@referalli/next';

const referalli = new Referalli(); // REFERALLI_API_KEY

export async function signUp(form: FormData) {
  const user = await db.users.create({ email: String(form.get('email')) });
  await attributeSignup({ client: referalli, programId: 'prg_...', customerRef: user.id, email: user.email });
}
```

`attributeSignup` reads the cookie, hashes the email and calls `associate` with the idempotency key `signup:<customerRef>`. It never throws.

## Webhooks (App Router)

```ts
// app/api/referalli/route.ts
import { createWebhookHandler } from '@referalli/next';

export const POST = createWebhookHandler({
  secret: process.env.REFERALLI_WEBHOOK_SECRET!,
  on: {
    'referral.created': async (event) => { /* event.data */ },
    'commission.earned': async (event) => { /* ... */ },
  },
});
```

The handler answers `400` when the signature is bad, `200` when the event is handled, and `500` when your handler throws, which makes Referalli retry the delivery. For full control, use `const event = await verifyWebhook(req, { secret })`.

## License

MIT
