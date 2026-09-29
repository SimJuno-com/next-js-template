import { Skeleton } from "@next-js-template/ui/components/skeleton";

import { CardFrame } from "@/components/card-frame";
import { EsimIdentitySkeleton } from "./esim-identity-skeleton";

export function EsimListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="grid gap-4 sm:gap-6 xl:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <CardFrame key={index}>
          <div className="flex min-w-0 flex-col gap-6 bg-background p-5 sm:p-6">
            <EsimIdentitySkeleton />
            <div className="space-y-4">
              <div className="rounded-xl border bg-muted/50 p-4">
                <Skeleton className="h-4 w-24" />
                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <Skeleton className="h-8 w-36 max-w-full" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[0, 1].map((field) => (
                  <div key={field} className="min-w-0 rounded-xl border bg-muted/50 px-3 py-2.5">
                    <Skeleton className="h-3.5 w-16 max-w-full" />
                    <Skeleton className="mt-1 h-5 w-24 max-w-full" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto flex gap-2">
              <Skeleton className="h-11 min-w-0 flex-1" />
              <Skeleton className="size-11 shrink-0" />
            </div>
          </div>
        </CardFrame>
      ))}
    </div>
  );
}
