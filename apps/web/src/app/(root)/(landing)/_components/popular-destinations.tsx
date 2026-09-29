"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@next-js-template/ui/components/button";
import { cn } from "@next-js-template/ui/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@next-js-template/ui/components/tabs";

import { CardFrame } from "@/components/card-frame";
import type {
  SimjunoDestination,
  SimjunoDestinationGroupKey,
  SimjunoDestinationGroups,
} from "@next-js-template/api/types";

import { Section } from "./section";

const tabs: ReadonlyArray<{
  key: SimjunoDestinationGroupKey;
  label: string;
  cardLabel: string;
}> = [
  { key: "Country", label: "Countries", cardLabel: "Country destination" },
  { key: "Region", label: "Regions", cardLabel: "Regional destination" },
  { key: "Global", label: "Global", cardLabel: "Global destination" },
];

export function PopularDestinations({ destinations }: { destinations: SimjunoDestinationGroups }) {
  return (
    <Section id="destinations" aria-labelledby="destinations-heading">
      <Tabs className="gap-0" defaultValue="Country">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              id="destinations-heading"
              className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-medium tracking-[-0.045em] text-balance text-foreground"
            >
              Popular destinations
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Pick your next stop and get connected with a travel eSIM in minutes.
            </p>
          </div>

          <TabsList
            aria-label="Destination types"
            className="max-w-full self-start rounded-xl border bg-muted/50 p-1 lg:shrink-0 group-data-horizontal/tabs:h-auto"
          >
            {tabs.map((tab) => (
              <TabsTrigger
                className="min-h-10 rounded-lg px-4 py-2 sm:px-5"
                key={tab.key}
                value={tab.key}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => {
          const activeDestinations = destinations[tab.key];

          return (
            <TabsContent key={tab.key} value={tab.key}>
              {activeDestinations.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  {activeDestinations.map((destination) => (
                    <DestinationCard
                      cardLabel={tab.cardLabel}
                      key={`${tab.key}-${destination.slug}`}
                      destination={destination}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-dashed bg-muted/30 px-5 py-12 text-center sm:mt-10 sm:px-6 sm:py-16">
                  <p className="font-medium text-foreground">
                    Popular destinations are taking a quick detour.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Please try again in a moment.
                  </p>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </Section>
  );
}

function DestinationCard({
  cardLabel,
  destination,
}: {
  cardLabel: string;
  destination: SimjunoDestination;
}) {
  return (
    <Link
      href={`/destination/${destination.slug}`}
      prefetch={false}
      aria-label={`View ${destination.name} plans`}
      className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <CardFrame className="shadow-surface">
        <div className="relative h-36 overflow-hidden">
          <Image
            src={`https://cdn.simjuno.com/img/destinations/${destination.slug}.webp`}
            alt={`${destination.name} travel destination`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="size-full object-cover transition-transform duration-200 group-hover/card:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          />
        </div>

        <div className="relative -mt-5 rounded-t-xl bg-background p-5 sm:p-6">
          <div className="absolute -top-12 right-5 flex size-20 items-center justify-center overflow-hidden rounded-xl bg-background ring-4 ring-background sm:right-6">
            <img
              src={`https://cdn.simjuno.com${destination.locationLogo}`.replace(".png", ".svg")}
              alt={`${destination.name} flag`}
              width={80}
              height={80}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>

          <div className="pr-20">
            <h3 className="truncate text-xl leading-7 font-medium tracking-tight">
              {destination.name}
            </h3>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{cardLabel}</p>
          </div>

          <div
            className={cn(
              buttonVariants(),
              "mt-6 h-11 w-full justify-between gap-3 px-5 group-hover/card:brightness-110",
            )}
          >
            <span>Starts from</span>
            <span className="flex items-center gap-2">
              <span className="text-base font-semibold tabular-nums">
                ${(destination.from / 10000).toFixed(2)}
              </span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </CardFrame>
    </Link>
  );
}
