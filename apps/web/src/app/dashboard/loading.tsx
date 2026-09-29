import { Skeleton } from "@next-js-template/ui/components/skeleton";

import { CardFrame } from "@/components/card-frame";
import { OrdersTableSkeleton } from "./_components/orders-table-skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading dashboard">
      <p className="sr-only">Loading your account summary and recent orders…</p>
      <div aria-hidden="true">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl leading-tight font-medium tracking-[-0.045em] sm:text-3xl">
            Dashboard
          </h1>
          <Skeleton className="mt-4 h-7 w-72 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {["Your eSIMs", "Total orders", "Awaiting payment"].map((label) => (
            <CardFrame key={label}>
              <div className="bg-background p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                  {label}
                  <Skeleton className="size-4 shrink-0" />
                </div>
                <Skeleton className="mt-3 h-9 w-12" />
                <Skeleton className="mt-4 h-6 w-36 max-w-full" />
              </div>
            </CardFrame>
          ))}
        </div>
        <div className="mt-8 sm:mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-medium tracking-tight">Recent orders</h2>
            <Skeleton className="h-9 w-32" />
          </div>
          <OrdersTableSkeleton />
        </div>
      </div>
    </div>
  );
}
