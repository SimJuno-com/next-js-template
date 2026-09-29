import { ChevronDown } from "lucide-react";
import type { DestinationPackage } from "@next-js-template/api/types";

import { allowanceDescription } from "@/lib/plan-display";

export function PlanDetails({ plan }: { plan: DestinationPackage }) {
  const coverage = plan.locationNetworkList;
  const coverageCount = plan.subLocationList?.length || coverage.length;
  return (
    <div className="space-y-4 text-sm">
      <p className="leading-6 text-muted-foreground">{allowanceDescription(plan.dataType)}</p>
      <dl className="space-y-3">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Network speed</dt>
          <dd className="text-right">{plan.speed || "Not specified"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Top-ups</dt>
          <dd>
            {plan.supportTopUpType === 2
              ? "Available"
              : plan.supportTopUpType === 1
                ? "Not available"
                : "Not specified"}
          </dd>
        </div>
      </dl>
      <details className="group rounded-xl border bg-background">
        <summary
          className={`flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-4 py-3 text-xs font-medium `}
        >
          Coverage & networks{coverageCount > 1 ? ` (${coverageCount})` : ""}
          <ChevronDown
            className="size-4 shrink-0 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="max-h-60 space-y-4 overflow-y-auto border-t p-4">
          {coverage.length > 0 ? (
            coverage.map((location) => (
              <div key={location.locationCode || location.locationName}>
                <p className="text-xs font-medium">{location.locationName}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {location.operatorList?.length
                    ? location.operatorList
                        .map((operator) => `${operator.operatorName} (${operator.networkType})`)
                        .join(" · ")
                    : "Network details not provided"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              {plan.location || "Coverage details not provided"}
            </p>
          )}
          {!!plan.subLocationList?.length && (
            <div>
              <p className="text-xs font-medium">Included destinations</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {plan.subLocationList.map((location) => location.name).join(", ")}
              </p>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
