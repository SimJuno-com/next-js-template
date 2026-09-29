"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Globe2,
  Signal,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { Button, buttonVariants } from "@next-js-template/ui/components/button";

import { CardFrame } from "@/components/card-frame";
import { BuyNowButton, CheckoutProvider } from "@/components/checkout";
import type { DestinationPackage, SimjunoDestination } from "@next-js-template/api/types";

import { useDestinationPlans } from "@/hooks/use-destination-data";
import { PlanDetails } from "./_components/plan-details";
import { PlanFilter } from "./_components/plan-filter";
import {
  durationKey,
  formatData,
  formatDuration,
  formatPackagePrice,
  sortPackages,
} from "@/lib/plan-display";

const PAGE_SIZE = 6;

export default function DestinationPage() {
  const data = useDestinationPlans();
  if (!data) notFound();

  return (
    <CheckoutProvider key={data.destination.slug}>
      <DestinationPlans {...data} />
    </CheckoutProvider>
  );
}

function DestinationPlans({
  destination,
  packages,
}: {
  destination: SimjunoDestination;
  packages: DestinationPackage[];
}) {
  const searchParams = useSearchParams();
  const plans = sortPackages(packages);
  const [durationFilter, setDurationFilter] = useState("all");
  const [dataType, setDataType] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [imageFailed, setImageFailed] = useState(false);
  const resultsRef = useRef<HTMLFieldSetElement>(null);
  const selected = plans.find((plan) => plan.slug === searchParams.get("package")) ?? plans[0];
  const selectedCode = selected?.packageCode;
  const durations = [...new Map(plans.map((plan) => [durationKey(plan), plan])).values()].sort(
    (a, b) => a.durationUnit.localeCompare(b.durationUnit) || a.duration - b.duration,
  );
  const hasDaily = plans.some((plan) => [2, 3, 4].includes(plan.dataType));
  const filtered = plans.filter(
    (plan) =>
      (durationFilter === "all" || durationKey(plan) === durationFilter) &&
      (dataType === "all" ||
        (dataType === "total" ? plan.dataType === 1 : [2, 3, 4].includes(plan.dataType))),
  );

  const selectionVisible = filtered
    .slice(0, visibleCount)
    .some((plan) => plan.packageCode === selectedCode);

  function revealSelection() {
    resetFilters();
    setVisibleCount(
      Math.max(PAGE_SIZE, plans.findIndex((plan) => plan.packageCode === selectedCode) + 1),
    );
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ block: "start" });
  }

  function resetFilters() {
    setDurationFilter("all");
    setDataType("all");
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <nav aria-label="Breadcrumb">
        <Link
          href="/destination"
          className={`inline-flex items-center gap-2 rounded text-sm text-muted-foreground transition-colors hover:text-foreground `}
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> All destinations
        </Link>
      </nav>

      <section className="relative isolate my-8 flex min-h-[380px] w-full items-end overflow-hidden rounded-2xl bg-muted sm:my-10 sm:min-h-[420px]">
        <div className="absolute inset-0">
          {imageFailed ? (
            <Globe2
              className="absolute inset-0 m-auto size-32 text-white/20"
              strokeWidth={0.8}
              aria-hidden="true"
            />
          ) : (
            <Image
              src={`https://cdn.simjuno.com/img/destinations/${destination.slug}.webp`}
              alt={`${destination.name} scenery`}
              fill
              sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), (max-width: 1216px) calc(100vw - 64px), 1152px"
              className="object-cover"
              loading="eager"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 backdrop-blur-md [mask-image:linear-gradient(to_bottom,transparent_15%,black_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5"
        />
        <div className="relative z-10 w-full p-5 text-white sm:p-8 lg:p-10">
          <h1 className="text-[clamp(2.75rem,5vw,3.5rem)] leading-[1.05] font-normal tracking-[-0.045em] text-balance">
            Stay connected in
            <br />
            <span className="font-serif tracking-[-0.035em] italic">{destination.name}.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-white/80">
            Find a data plan for your trip. Compare allowances, duration, and local networks before
            you choose.
          </p>
        </div>
      </section>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/30 px-5 py-12 text-center sm:px-6 sm:py-16">
          <Globe2 className="mx-auto mb-4 size-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-xl font-medium">No plans available just yet</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Check back soon for {destination.name}, or explore another destination.
          </p>
          <Link
            href="/destination"
            className={buttonVariants({ variant: "outline", className: "mt-6 h-11 gap-2 px-5" })}
          >
            Browse destinations <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <section aria-label="Available eSIM plans">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
            <div>
              <div className="mb-6">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-medium tracking-tight">Choose your plan</h2>
                  <PlanFilter
                    label="Duration"
                    value={durationFilter}
                    options={[
                      { value: "all", label: "All durations" },
                      ...durations.map((plan) => ({
                        value: durationKey(plan),
                        label: formatDuration(plan),
                      })),
                    ]}
                    onChange={(value) => {
                      setDurationFilter(value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Compare data and duration. Prices are shown per plan.
                </p>
                {hasDaily && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <PlanFilter
                      label="Data allowance"
                      value={dataType}
                      options={[
                        { value: "all", label: "All data plans" },
                        { value: "total", label: "Total data" },
                        { value: "daily", label: "Daily / unlimited" },
                      ]}
                      onChange={(value) => {
                        setDataType(value);
                        setVisibleCount(PAGE_SIZE);
                      }}
                    />
                  </div>
                )}
              </div>
              <p role="status" className="mb-4 text-sm text-muted-foreground">
                Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}{" "}
                {filtered.length === 1 ? "plan" : "plans"}
              </p>
              <fieldset
                ref={resultsRef}
                tabIndex={-1}
                className={`min-w-0 scroll-mt-24 rounded-2xl `}
              >
                <legend className="sr-only">Choose your eSIM plan</legend>
                <div className="gap-4 sm:gap-6 grid sm:grid-cols-2">
                  {filtered.slice(0, visibleCount).map((plan) => (
                    <label
                      key={plan.packageCode}
                      className={`relative flex min-w-0 cursor-pointer flex-col rounded-2xl border p-0.5 transition-colors motion-reduce:transition-none has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-primary ${selectedCode === plan.packageCode ? "border-primary bg-primary/10 ring-1 ring-primary" : "bg-background hover:border-primary/60 hover:bg-muted/30"}`}
                    >
                      <input
                        type="radio"
                        name="esim-plan"
                        value={plan.packageCode}
                        checked={selectedCode === plan.packageCode}
                        onChange={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.set("package", plan.slug);
                          window.history.replaceState(null, "", url);
                        }}
                        aria-label={`${formatData(plan)}, ${formatDuration(plan)}, ${plan.name}, ${formatPackagePrice(plan)} ${plan.currencyCode}`}
                        className="peer sr-only"
                      />
                      <div className="flex h-full min-w-0 flex-col rounded-[calc(var(--radius-2xl)-3px)] border border-border/60 p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-2xl font-medium tracking-tight">
                            {formatData(plan)}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border ${selectedCode === plan.packageCode ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50"}`}
                          >
                            {selectedCode === plan.packageCode && (
                              <Check className="size-3.5" strokeWidth={3} />
                            )}
                          </span>
                        </div>
                        <span className="mt-1 text-sm text-muted-foreground">
                          Valid for {formatDuration(plan)}
                        </span>
                        <span className="mt-4 mb-auto flex flex-col items-start gap-2">
                          <span className="text-xs leading-5 break-words text-muted-foreground">
                            {plan.name}
                          </span>
                          <span className="flex gap-1.5 text-xs text-muted-foreground">
                            <Signal className="size-3.5 shrink-0" aria-hidden="true" />
                            {plan.speed || "See network details"}
                          </span>
                        </span>

                        <span className="mt-6 flex items-baseline justify-between gap-2 border-t pt-4">
                          <span className="text-xs text-muted-foreground">Plan price</span>
                          <span className="text-lg font-semibold tabular-nums">
                            {formatPackagePrice(plan)}{" "}
                            <span className="text-[10px] font-normal text-muted-foreground">
                              {plan.currencyCode}
                            </span>
                          </span>
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-dashed bg-muted/30 px-5 py-12 text-center sm:px-6 sm:py-16">
                  <p className="font-medium">No plans match these filters</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className={`mt-3 rounded px-3 py-2 text-sm underline underline-offset-4 `}
                  >
                    Show all plans
                  </button>
                </div>
              )}
              {filtered.length > visibleCount && (
                <Button
                  variant="outline"
                  className="mt-6 h-11 w-full"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more plans{" "}
                  <ChevronDown className="size-4" aria-hidden="true" />
                </Button>
              )}
            </div>

            <aside
              aria-label="Your selected plan"
              className="scroll-mt-24 lg:sticky lg:top-24"
              id="selected-plan"
            >
              <CardFrame>
                <div className="bg-muted/30 p-5 sm:p-6">
                  <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    Your selected plan
                  </p>
                  <h2 className="mt-3 text-xl font-medium break-words">{destination.name} eSIM</h2>
                  {selected && (
                    <>
                      {!selectionVisible && (
                        <div className="mt-4 rounded-xl border bg-background p-3 text-xs leading-5">
                          <p className="text-muted-foreground">
                            Your selected plan is outside the current results.
                          </p>
                          <button
                            type="button"
                            onClick={revealSelection}
                            className={`mt-1 min-h-11 rounded px-2 font-medium underline underline-offset-4 `}
                          >
                            Show selected plan
                          </button>
                        </div>
                      )}
                      <div aria-live="polite" aria-atomic="true" className="mt-6">
                        <p className="text-3xl font-medium tracking-tight">
                          {formatData(selected)}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          For {formatDuration(selected)}
                        </p>
                      </div>
                      <div className="mt-6">
                        <PlanDetails plan={selected} />
                      </div>
                      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2 border-t pt-4">
                        <span className="text-sm text-muted-foreground">Plan price</span>
                        <span className="text-2xl font-medium tabular-nums">
                          {formatPackagePrice(selected)}{" "}
                          <span className="text-xs text-muted-foreground">
                            {selected.currencyCode}
                          </span>
                        </span>
                      </div>
                      <BuyNowButton packageSlug={selected.slug} className="mt-6 h-11 w-full" />
                    </>
                  )}
                </div>
              </CardFrame>
              <p className="mt-4 flex items-start gap-2 px-2 text-xs leading-5 text-muted-foreground">
                <Smartphone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                You’ll need an eSIM-compatible, carrier-unlocked device.
              </p>
            </aside>
          </div>
          {selected && (
            <div className="sticky bottom-[max(2.75rem,env(safe-area-inset-bottom))] z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur lg:hidden">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {formatData(selected)} · {formatDuration(selected)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatPackagePrice(selected)} {selected.currencyCode}
                </p>
              </div>
              <BuyNowButton
                packageSlug={selected.slug}
                className="h-11 shrink-0 px-4 text-xs font-medium"
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
