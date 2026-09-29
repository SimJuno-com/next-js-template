# @next-js-template/auth

Authentication with [Better Auth](https://better-auth.com) and its Drizzle adapter.

- Email/password login, plus Google OAuth when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Anonymous (guest) sessions, so users can check out without an account
- A custom `checkout` plugin (`src/checkout.ts`) that lets a user claim guest orders through a short-lived, hashed checkout cookie (`src/checkout-access.ts`)

The handler is mounted in the Next.js app at `apps/web/src/app/api/auth/[...all]/route.ts`.

## Usage

```ts
import { createAuth } from "@next-js-template/auth";
```

## Schema

Better Auth tables are generated into `packages/db/src/schema/auth.ts`:

```bash
bun run auth:generate
```

After regenerating, run `bun run db:generate` and then `bun run db:migrate`.
