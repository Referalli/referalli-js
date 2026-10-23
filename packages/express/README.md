# @referalli/express

[Referalli](https://referalli.com) middleware for Express 4 and 5, and for any Node `http` handler that takes `(req, res, next)`:

- Webhook signature verification that handles the raw body for you
- First-party referral attribution cookies

```sh
npm install @referalli/express referalli
```

## Webhooks

```ts
import express from 'express';
import { referalliWebhook } from '@referalli/express';

const app = express();

// Mount it before express.json(), or after express.raw() on this route.
app.post('/webhooks/referalli', referalliWebhook({ secret: process.env.REFERALLI_WEBHOOK_SECRET! }), (req, res) => {
  const event = req.referalliEvent!; // typed; also in req.body
  if (event.topic === 'commission.earned') {
    /* ... */
  }
  res.json({ received: true });
});

app.use(express.json());
```

The middleware verifies the exact bytes Referalli signed. It reads them from the request stream, from the output of `express.raw()`, or from a `req.rawBody` your parser kept. If the body was already parsed, it raises a clear error instead. It answers `400` with a `reason` (`missing_headers`, `timestamp` or `signature`) when verification fails. Options: `secret` (pass an array while rotating), `toleranceSec` (default 300) and `limit` (default 1 MB).

## Attribution

```ts
import { Referalli } from 'referalli';
import { attributeSignup, referalliAttribution } from '@referalli/express';

const referalli = new Referalli(); // REFERALLI_API_KEY

app.use(referalliAttribution({ cookieDomain: '.example.com' }));

app.get('/', (req, res) => res.send(req.referral?.code ? 'Welcome, friend of a partner!' : 'Welcome'));

app.post('/signup', async (req, res) => {
  const user = await createUser(req.body);
  await attributeSignup(req, { client: referalli, programId: 'prg_...', customerRef: user.id, email: user.email });
  res.json(user);
});
```

If a request URL carries `?via=`, `?ref=`, `?aff=` or `ref_click_id`, `referalliAttribution()` sets the referral cookie. The cookie is the same first-party one the browser tracker uses. Every request gets `req.referral`. If you pass `publishableKey`, the middleware also records the landing on the server. `attributeSignup` calls `associate` with the idempotency key `signup:<customerRef>` and never throws.

## License

MIT
