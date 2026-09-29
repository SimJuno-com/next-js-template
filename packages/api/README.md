# @next-js-template/api

Type-safe API built with [oRPC](https://orpc.unnoq.com). It uses a contract-first layout with Zod schemas.

- `src/contract/` holds the procedure contracts (inputs and outputs) for `catalog`, `order` and `esim`
- `src/router/` implements the contract, and `index.ts` exports `router`
- `src/types/` holds the shared types, including `AppRouterClient`, for the frontend
- `src/lib/` holds the integrations: Stripe (payments), Simjuno (eSIM provider), order fulfillment and eSIM sync

The router is served by the Next.js app at `apps/web/src/app/api/rpc/[[...rest]]/route.ts`.

## Usage

```ts
// server
import { router } from "@next-js-template/api";

// client (types only)
import type { AppRouterClient } from "@next-js-template/api/types";
```

## Adding a procedure

1. Define it in `src/contract/<domain>.ts` and register it in `src/contract/index.ts`
2. Implement it in `src/router/<domain>.ts` and register it in `src/router/index.ts`

Requires the `STRIPE_*` and `SIMJUNO_*` env vars (see `@next-js-template/env`).
