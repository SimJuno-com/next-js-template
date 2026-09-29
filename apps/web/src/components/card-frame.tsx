import type { ReactNode } from "react";

import { cn } from "@next-js-template/ui/lib/utils";

export function CardFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("group/card rounded-2xl border p-0.5", className)}>
      <div className="overflow-hidden rounded-[calc(var(--radius-2xl)-3px)] border bg-background">
        {children}
      </div>
    </div>
  );
}
