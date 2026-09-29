import { Skeleton } from "@next-js-template/ui/components/skeleton";

export function EsimIdentitySkeleton({ detail = false }: { detail?: boolean }) {
  return (
    <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-3 gap-y-2 min-[400px]:grid-cols-[3rem_minmax(0,1fr)_auto]">
      <div className="flex size-12 items-center">
        <Skeleton className="h-9 w-12 rounded-lg" />
      </div>
      <div className="min-w-0 self-center">
        <Skeleton className={`w-full max-w-64 ${detail ? "h-7 sm:h-8" : "h-6"}`} />
        <Skeleton className="-mt-1 h-6 w-44 max-w-full" />
      </div>
      <div className="col-start-2 min-[400px]:col-start-3 min-[400px]:pt-1">
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
    </div>
  );
}
