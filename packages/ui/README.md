# @next-js-template/ui

Shared UI package for the monorepo.

- **Components:** [shadcn/ui](https://ui.shadcn.com) (`base-nova` style, built on Base UI)
- **Icons:** [Lucide](https://lucide.dev) via `lucide-react`
- **Styling:** Tailwind CSS v4, theme tokens in `src/styles/globals.css`

## Usage

```tsx
import { Button } from "@next-js-template/ui/components/button";
import { Plus } from "lucide-react";

<Button>
  <Plus /> Add
</Button>;
```

Import global styles once in the app:

```ts
import "@next-js-template/ui/globals.css";
```

## Adding components

Run from this package directory:

```bash
bunx shadcn@latest add <component>
```

Components land in `src/components/` and are configured by `components.json`.
