import { Skeleton } from "@next-js-template/ui/components/skeleton";

import { DashboardHeader } from "../_components/dashboard-ui";
import { OrdersTableSkeleton } from "../_components/orders-table-skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading orders">
      <p className="sr-only">Loading your order history and filters…</p>
      <div aria-hidden="true">
        <DashboardHeader
          title="Orders"
          description="Your purchases and receipts, newest first. Search by order ID or package name."
        />
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-40" />
        </div>
        <OrdersTableSkeleton rows={10} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-5 w-28" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
