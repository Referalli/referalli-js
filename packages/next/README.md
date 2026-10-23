# @referalli/next

Next.js support for [Referalli](https://referalli.com):

- Middleware that saves `?ref=` into a first-party cookie on your domain
- `getReferral()` for server components, route handlers and server actions
- Signup attribution
- Webhook route handlers

```sh
npm install @referalli/next referalli
```

## Middleware

```ts
// middleware.ts
export { referalliMiddleware as middleware } from '@referalli/next/middleware';
export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] };
```

If a request URL carries `?via=`, `?ref=`, `?aff=` or `ref_click_id`, the middleware sets the referral cookie. It is not HttpOnly, so the browser tracker shares it. You can pass options, or add it to a middleware you already have:

```ts
import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';
import { captureReferral } from '@referalli/next/middleware';

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const res = NextResponse.next();
  return captureReferral(req, res, { cookieDomain: '.example.com', publishableKey: 'tok_...' }, event);
}
```

With `publishableKey` set, the middleware also records the landing on the server. The landing then counts even on pages that never load the browser tracker. The middleware only imports edge-safe code.

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
