import { Skeleton } from "@next-js-template/ui/components/skeleton";
import { ChevronRight } from "lucide-react";

import { CardFrame } from "@/components/card-frame";
import { PAGE_SIZE } from "@/lib/destination-search";

export default function DestinationLoading() {
  return (
    <div
      role="status"
      aria-label="Loading destinations"
      className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8"
    >
      <p className="sr-only">Loading destinations, search, and filters…</p>
      <div aria-hidden="true">
        <div className="flex flex-col items-center py-12 text-center sm:py-16 lg:py-20">
          <h1 className="text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.045em] text-balance text-foreground">
            Browse{" "}
            <span className="font-serif text-[1.05em] tracking-[-0.035em] text-primary italic">
              destinations
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-pretty text-muted-foreground">
            Search by country, region, or global plan and choose a data plan.
          </p>
          <Skeleton className="mt-8 h-27.5 w-full max-w-xl rounded-2xl sm:mt-10 sm:h-16" />
        </div>
        <div className="pb-12 sm:pb-16 lg:pb-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Skeleton className="h-12.5 w-80 max-w-full rounded-xl" />
            <Skeleton className="ml-auto h-11 w-40 rounded-lg" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <CardFrame key={index}>
                <div className="flex min-h-20 items-center gap-4 bg-background px-5 py-4 sm:px-6">
                  <Skeleton className="h-[30px] w-10 shrink-0 rounded-sm" />
                  <Skeleton className="h-5 w-3/5" />
                  <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
                </div>
              </CardFrame>
            ))}
          </div>
          <div className="mt-8 flex min-h-24 flex-col items-center justify-between gap-4 sm:min-h-11 sm:flex-row">
            <Skeleton className="h-5 w-52 max-w-full" />
            <Skeleton className="h-11 w-72 max-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
