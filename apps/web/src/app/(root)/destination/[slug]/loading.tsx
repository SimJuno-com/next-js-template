import { Skeleton } from "@next-js-template/ui/components/skeleton";

import { CardFrame } from "@/components/card-frame";

export default function DestinationPlansLoading() {
  return (
    <div
      role="status"
      aria-label="Loading destination plans"
      className="mx-auto w-full max-w-[76rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <p className="sr-only">Loading destination plans, prices, and network coverage…</p>
      <div aria-hidden="true">
        <div className="flex h-6 items-center">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="my-8 flex min-h-[380px] w-full items-end overflow-hidden rounded-2xl bg-muted sm:my-10 sm:min-h-[420px]">
          <div className="w-full p-5 text-white sm:p-8 lg:p-10">
            <div className="text-[clamp(2.75rem,5vw,3.5rem)] leading-[1.05] font-normal tracking-[-0.045em] text-balance">
              Stay connected in
              <div className="flex h-[1.05em] items-center">
                <Skeleton className="h-[0.8em] w-2/3 max-w-[10ch] bg-white/20" />
              </div>
            </div>
            <p className="mt-4 max-w-lg text-base leading-7 text-white/80">
              Find a data plan for your trip. Compare allowances, duration, and local networks
              before you choose.
            </p>
          </div>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <div className="min-w-0">
            <div className="mb-6">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-medium tracking-tight">Choose your plan</h2>
                <Skeleton className="h-11 w-40 rounded-lg" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Compare data and duration. Prices are shown per plan.
              </p>
            </div>
            <Skeleton className="mb-4 h-5 w-36" />
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {Array.from({ length: 6 }, (_, index) => (
                <CardFrame key={index}>
                  <div className="flex min-w-0 flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="mt-1 size-5 shrink-0 rounded-full" />
                    </div>
                    <Skeleton className="mt-1 h-5 w-28 max-w-full" />
                    <div className="mt-4 mb-auto space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="mt-6 flex items-baseline justify-between gap-2 border-t pt-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-7 w-20" />
                    </div>
                  </div>
                </CardFrame>
              ))}
            </div>
            <Skeleton className="mt-6 h-11 w-full rounded-lg" />
          </div>
          <div className="min-w-0 lg:sticky lg:top-24">
            <CardFrame>
              <div className="bg-muted/30 p-5 sm:p-6">
                <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  Your selected plan
                </p>
                <Skeleton className="mt-3 h-7 w-48 max-w-full" />
                <Skeleton className="mt-6 h-9 w-28" />
                <Skeleton className="mt-1 h-5 w-24" />
                <div className="mt-6 space-y-4">
                  <div className="space-y-2 py-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="space-y-3">
                    {[0, 1].map((field) => (
                      <div key={field} className="flex justify-between gap-4">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10.5 w-full rounded-xl" />
                </div>
                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2 border-t pt-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-28" />
                </div>
                <Skeleton className="mt-6 h-11 w-full" />
              </div>
            </CardFrame>
            <div className="mt-4 flex items-start gap-2 px-2">
              <Skeleton className="mt-0.5 size-4 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-[max(2.75rem,env(safe-area-inset-bottom))] z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur lg:hidden">
          <div>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-1 h-4 w-20" />
          </div>
          <Skeleton className="h-11 w-28 shrink-0" />
        </div>
      </div>
    </div>
  );
}
