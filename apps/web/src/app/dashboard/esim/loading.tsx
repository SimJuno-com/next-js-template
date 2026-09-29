import { Skeleton } from "@next-js-template/ui/components/skeleton";

import { DashboardHeader } from "../_components/dashboard-ui";
import { EsimListSkeleton } from "./_components/esim-list-skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading your eSIMs">
      <p className="sr-only">Loading your eSIMs, data usage, and validity…</p>
      <div aria-hidden="true">
        <DashboardHeader
          title="Your eSIMs"
          description="Your travel plans, all in one place. Check your data or get ready to connect."
        />
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-40" />
        </div>
        <EsimListSkeleton />
      </div>
    </div>
  );
}
