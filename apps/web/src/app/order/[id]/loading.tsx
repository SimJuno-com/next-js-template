import { Skeleton } from "@next-js-template/ui/components/skeleton";

import { CardFrame } from "@/components/card-frame";
import { PaymentSkeleton } from "./_components/payment-skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading order">
      <p className="sr-only">Loading your order summary and payment details…</p>
      <div aria-hidden="true">
        <Skeleton className="mb-6 h-[1.875rem] w-80 max-w-full" />
        <Skeleton className="mb-6 h-10 w-20 rounded-lg" />
        <CardFrame>
          <div className="px-5 py-6 sm:px-6 sm:py-8">
            <Skeleton className="mx-auto mb-6 size-10" />
            <Skeleton className="mx-auto h-7 w-52 max-w-full" />
            <div className="mt-3 flex items-baseline justify-center gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-5 w-8" />
            </div>
            <div className="mt-8">
              <PaymentSkeleton />
            </div>
          </div>
          <div className="border-t bg-muted/30 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-center gap-1">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-6 w-48 max-w-full" />
            </div>
          </div>
        </CardFrame>
        <Skeleton className="mx-auto mt-6 h-4 w-28" />
      </div>
    </div>
  );
}
