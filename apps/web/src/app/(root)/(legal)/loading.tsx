import { Skeleton } from "@next-js-template/ui/components/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading legal document" className="max-w-2xl">
      <p className="sr-only">Loading the legal document…</p>
      <div aria-hidden="true">
        <div className="border-b border-border pb-8 md:pb-10">
          <Skeleton className="h-[1.1em] w-4/5 text-[clamp(2rem,4vw,3rem)]" />
          <div className="mt-4 space-y-3 py-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="mt-6 h-4 w-48 max-w-full" />
        </div>
        <div className="mt-8 flex flex-col gap-8 sm:mt-10 sm:gap-10">
          {[0, 1, 2, 3, 4, 5].map((clause) => (
            <div key={clause} className="flex items-start gap-3">
              <Skeleton className="mt-0.5 size-6 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-6 w-56 max-w-full" />
                <div className="mt-3 space-y-2 py-1">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-4/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t pt-8 sm:mt-12">
          <div className="rounded-2xl border bg-muted/30 p-5 sm:p-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-3 h-6 w-40" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
