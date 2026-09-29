# @next-js-template/env

Environment variables, validated with Zod through [T3 Env](https://env.t3.gg). The app fails fast when a variable is missing or invalid.

| Import                         | Scope                                            |
| ------------------------------ | ------------------------------------------------ |
| `@next-js-template/env/server` | Server-only secrets (never import on the client) |
| `@next-js-template/env/web`    | `NEXT_PUBLIC_*` values safe for the browser      |

```ts
import { env } from "@next-js-template/env/server";
```

## Adding a variable

Add it to the schema in `src/server.ts` or `src/web.ts`. For client variables, also add it to `runtimeEnv`.

Set `SKIP_ENV_VALIDATION=1` to skip server validation, for example in CI builds.
