# Referalli JavaScript SDKs

The official JavaScript and TypeScript packages for [Referalli](https://referalli.com).

| Package | Install | What it is |
| --- | --- | --- |
| [`referalli`](./packages/referalli) | `npm install referalli` | Typed API client for Node.js and the browser, webhook verification, the tracking snippet |
| [`@referalli/react`](./packages/react) | `npm install @referalli/react` | React provider and hooks |
| [`@referalli/next`](./packages/next) | `npm install @referalli/next` | Next.js middleware and server helpers |
| [`@referalli/express`](./packages/express) | `npm install @referalli/express` | Express webhook verification and attribution middleware |

Every client defaults to `https://referalli.com` and authenticates with an API key from **Settings → API keys**. See each package's README for a runnable example, and [referalli.com/docs](https://referalli.com/docs) for guides.

## Development

```sh
npm install
npm run build --workspaces
npm test --workspaces
```

This repository is generated from the Referalli monorepo: see [CONTRIBUTING.md](https://github.com/Referalli/.github/blob/main/CONTRIBUTING.md). Each package is released on its own tag (`referalli-v1.2.3`, `react-v1.2.3`, …) by `.github/workflows/release.yml`.

MIT licensed.
