# next-js-template

A Next.js monorepo for selling eSIMs. It uses Bun workspaces and Turborepo, and was scaffolded with [Better-T-Stack](https://better-t-stack.dev).

## Stack

- **App:** Next.js (React 19, React Compiler), TanStack Query/Form/Table
- **API:** oRPC, contract-first with Zod
- **Auth:** Better Auth (email/password, Google, guest checkout)
- **Database:** PostgreSQL + Drizzle ORM
- **UI:** shadcn/ui, Lucide icons, Tailwind CSS v4
- **Payments / eSIM:** Stripe, Simjuno
- **Tooling:** Bun, Turborepo, oxlint, oxfmt, Docker, Vercel

## Structure

```
apps/
  web/          Next.js app (port 3000)
packages/
  api/          oRPC contract, router and integrations
  auth/         Better Auth config
  config/       Shared tsconfig
  db/           Drizzle schema, client and migrations
  env/          Validated env vars (server / web)
  ui/           Shared shadcn components
```

Each package has its own README with details.

## Getting started

Needs [Bun](https://bun.sh) and Docker.

```bash
bun install
```

Create `apps/web/.env`. The required variables are defined in `packages/env/src/server.ts` and `packages/env/src/web.ts`.

```bash
bun run db:start
```

```bash
bun run db:migrate
```

```bash
bun run dev
```

The app runs at http://localhost:3000.

## Scripts

| Command                        | What it does                             |
| ------------------------------ | ---------------------------------------- |
| `bun run dev`                  | Run all apps in dev mode                 |
| `bun run build`                | Build everything                         |
| `bun run check-types`          | Type-check all packages                  |
| `bun run check`                | Lint (oxlint) and format (oxfmt)         |
| `bun run db:start` / `db:stop` | Start / stop local Postgres              |
| `bun run db:generate`          | Generate a migration from schema changes |
| `bun run db:migrate`           | Apply migrations                         |
| `bun run db:studio`            | Open Drizzle Studio                      |
| `bun run auth:generate`        | Regenerate Better Auth tables            |
| `bun run docker:up`            | Run app + Postgres in Docker             |
| `bun run deploy`               | Deploy to Vercel (production)            |
