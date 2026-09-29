import type { DestinationPackage } from "@next-js-template/api/types";
import { CardSim, Globe, Signal } from "lucide-react";
import Image from "next/image";

import { CopyButton } from "@/components/copy-button";
import { client } from "@/lib/orpc";
import { formatData, formatDuration } from "@/lib/plan-display";
import { StatusBadge } from "../../_components/dashboard-ui";

type Esim = Awaited<ReturnType<typeof client.esim.list>>["esims"][number];

// Catalog failures must not hide an already-purchased eSIM or its installation code.
export async function getEsimPlan(slug: string) {
  return client.catalog
    .getPackage({ slug }, { signal: AbortSignal.timeout(5_000) })
    .catch(() => null);
}

export function EsimIdentity({
  esim,
  plan,
  heading = "h2",
}: {
  esim: Esim;
  plan: DestinationPackage | null;
  heading?: "h1" | "h2";
}) {
  const Heading = heading;
  const location = plan?.locationNetworkList.length === 1 ? plan.locationNetworkList[0] : null;
  const Icon = plan && plan.locationNetworkList.length > 1 ? Globe : CardSim;

  return (
    <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-3 gap-y-2 min-[400px]:grid-cols-[3rem_minmax(0,1fr)_auto]">
      <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden text-muted-foreground">
        {location?.locationLogo ? (
          <Image
            src={`https://cdn.simjuno.com${location.locationLogo}`.replace(".png", ".svg")}
            alt=""
            width={48}
            height={36}
            unoptimized
            className="h-9 w-12 object-cover rounded-lg"
          />
        ) : (
          <Icon aria-hidden="true" className="size-6" strokeWidth={1.5} />
        )}
      </span>
      <div className="min-w-0 self-center">
        <Heading
          className={`font-semibold tracking-tight break-words ${heading === "h1" ? "text-xl sm:text-2xl" : "text-sm leading-6"}`}
        >
          {esim.packageName}
        </Heading>
        <div className="group -mt-1 flex max-w-full flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <div className="inline-flex min-w-0 max-w-full items-center gap-1">
            <span className="min-w-0 font-mono break-all select-all">{esim.id}</span>
            <div className="shrink-0 opacity-0 transition-opacity ease-out group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100">
              <CopyButton
                className="rounded-md border-none text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5"
                variant="ghost"
                size="icon-xs"
                text={esim.id}
                aria-label="Copy eSIM ID"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-start-2 max-w-32 min-[400px]:col-start-3 min-[400px]:pt-1">
        <span className="sr-only">Status: </span>
        <StatusBadge status={esim.status} />
      </div>
    </div>
  );
}

export function EsimUsage({ esim, plan }: { esim: Esim; plan: DestinationPackage | null }) {
  const hasUsage = esim.totalData > 0;
  const used = formatData({ volume: esim.dataUsage, dataType: 1 });
  const total = formatData({ volume: esim.totalData, dataType: 1 });
  const percent = hasUsage ? Math.min(100, Math.round((esim.dataUsage / esim.totalData) * 100)) : 0;
  const expires =
    esim.expiresAt && !Number.isNaN(Date.parse(esim.expiresAt)) ? new Date(esim.expiresAt) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-muted/50 p-4">
        <h3 className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Signal aria-hidden="true" className="size-4 text-primary" /> Data usage
        </h3>
        {hasUsage ? (
          <>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 tabular-nums">
              <p>
                <span className="text-2xl font-semibold tracking-tight">{used}</span>
                <span className="text-sm text-muted-foreground"> / {total}</span>
              </p>
              <p className="text-xs text-muted-foreground">{percent}% used</p>
            </div>
            <progress
              value={Math.min(esim.dataUsage, esim.totalData)}
              max={esim.totalData}
              aria-label={`Data usage for ${esim.packageName}`}
              aria-valuetext={`${used} of ${total} used`}
              className="mt-3 block h-1.5 w-full appearance-none overflow-hidden rounded-full border-0 bg-primary/10 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-primary/10 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary"
            />
          </>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Not available yet</p>
        )}
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border bg-muted/50 px-3 py-2.5">
          <dt className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            Valid for
          </dt>
          <dd className="mt-1 tabular-nums">{plan ? formatDuration(plan) : "Not available yet"}</dd>
        </div>
        <div className="rounded-xl border bg-muted/50 px-3 py-2.5">
          <dt className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            Valid until
          </dt>
          <dd className="mt-1 tabular-nums">
            {expires ? (
              <time
                dateTime={esim.expiresAt!}
                title={`${expires.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC`}
              >
                {expires.toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" })}
              </time>
            ) : (
              "Not available yet"
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
