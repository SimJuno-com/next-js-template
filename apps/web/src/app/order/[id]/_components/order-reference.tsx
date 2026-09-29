"use client";

import { CopyButton } from "@/components/copy-button";

export function OrderReference({ id }: { id: string }) {
  return (
    <div className="text-center text-xs text-muted-foreground">
      <div className="group inline-flex max-w-full flex-wrap items-center justify-center gap-1">
        <span>Order id:</span>
        <div className="inline-flex min-w-0 max-w-full items-center gap-1">
          <span className="min-w-0 font-mono break-all select-all">{id}</span>
          <div className="shrink-0 opacity-0 transition-opacity ease-out group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100">
            <CopyButton
              className="rounded-md border-none text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5"
              variant="ghost"
              size="icon-xs"
              text={id}
              aria-label="Copy order ID"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
