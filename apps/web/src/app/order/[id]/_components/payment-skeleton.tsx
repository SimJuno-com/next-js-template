import { Skeleton } from "@next-js-template/ui/components/skeleton";

export function PaymentSkeleton() {
  return (
    <div aria-busy="true">
      <p role="status" className="sr-only">
        Loading secure payment…
      </p>
      <div
        aria-hidden="true"
        className="space-y-4 [&_[data-slot=skeleton]]:motion-reduce:animate-none"
      >
        <div className="space-y-4 rounded-lg border bg-background p-4">
          <Skeleton className="h-5 w-20" />
          <div className="grid grid-cols-2 gap-4">
            {["col-span-2", "", "", "col-span-2"].map((className, index) => (
              <Skeleton key={index} className={`h-14 w-full rounded-lg ${className}`} />
            ))}
          </div>
          <div className="space-y-4 rounded-lg border p-3">
            <Skeleton className="h-5 w-3/4" />
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="mx-auto h-4 w-32" />
      </div>
    </div>
  );
}
