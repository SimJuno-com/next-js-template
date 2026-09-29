"use client";

import { buttonVariants } from "@next-js-template/ui/components/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, type ReactNode } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@next-js-template/ui/components/command";

import { cn } from "@next-js-template/ui/lib/utils";
import type {
  SimjunoDestination,
  SimjunoDestinationGroupKey,
  SimjunoDestinationGroups,
} from "@next-js-template/api/types";

type DestinationSearchTriggerProps = {
  type: "button";
  "aria-label": string;
  "aria-haspopup": "dialog";
  "aria-expanded": boolean;
  "aria-controls": string | undefined;
  onClick: () => void;
};

export type DestinationSearchCommandProps = {
  destinations: SimjunoDestinationGroups;
  className?: string;
  placeholder?: string;
  buttonLabel?: string;
  renderTrigger?: (props: DestinationSearchTriggerProps) => ReactNode;
  onDestinationSelect?: (destination: SimjunoDestination) => void;
};

export function DestinationSearchCommand({
  destinations,
  className,
  placeholder = "Where are you traveling?",
  buttonLabel = "Find a plan",
  renderTrigger,
  onDestinationSelect,
}: DestinationSearchCommandProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const commandId = useId();
  const destinationGroups: ReadonlyArray<{
    key: SimjunoDestinationGroupKey;
    heading: string;
  }> = [
    { key: "Country", heading: "Countries" },
    { key: "Region", heading: "Regions" },
    { key: "Global", heading: "Global" },
  ];

  function handleDestinationSelect(destination: SimjunoDestination) {
    setIsOpen(false);
    router.push(`/destination/${destination.slug}`);
    onDestinationSelect?.(destination);
  }

  const triggerProps: DestinationSearchTriggerProps = {
    type: "button",
    "aria-label": `${placeholder} ${buttonLabel}`,
    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
    "aria-controls": isOpen ? commandId : undefined,
    onClick: () => setIsOpen(true),
  };

  return (
    <>
      {renderTrigger ? (
        renderTrigger(triggerProps)
      ) : (
        <button
          {...triggerProps}
          className={cn(
            "group/search flex min-h-16 w-full max-w-xl cursor-pointer flex-col gap-2 rounded-2xl  bg-background/95 p-2 text-muted-foreground ring-4 ring-background/35 select-none dark:ring-white/10",
            "shadow-surface focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-primary",
            "sm:flex-row sm:items-center sm:pl-4",
            className,
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2 sm:px-0 sm:py-0">
            <Search className="size-5 shrink-0" aria-hidden="true" />
            <span className="truncate text-left text-base font-medium">{placeholder}</span>
          </span>
          <span
            className={cn(
              buttonVariants({
                className: "h-11 px-5 text-sm group-hover/search:brightness-110",
              }),
            )}
          >
            {buttonLabel}
          </span>
        </button>
      )}

      <CommandDialog
        className="top-1/2! max-h-[calc(100dvh-2rem)] -translate-y-1/2! sm:max-w-2xl"
        description="Search destinations and travel eSIM plans."
        onOpenChange={setIsOpen}
        open={isOpen}
        title="Find a travel plan"
      >
        <Command id={commandId} className="p-2 [&_[data-slot=input-group]]:h-11!">
          <CommandInput className="text-base" placeholder={placeholder} />
          <CommandList className="scroll-fade h-[min(30rem,calc(100dvh-12rem))] min-h-0 max-h-none">
            <CommandEmpty>No destinations found.</CommandEmpty>
            {destinationGroups.map(({ key, heading }) => (
              <CommandGroup heading={heading} key={key}>
                {destinations[key].map((destination) => (
                  <CommandItem
                    className="min-h-11 px-3 py-2 [&>svg:last-child]:hidden"
                    key={`${key}-${destination.slug}`}
                    keywords={[destination.slug, destination.locationName, heading]}
                    onSelect={() => handleDestinationSelect(destination)}
                    value={`${destination.name} ${destination.slug}`}
                  >
                    <img
                      src={`https://cdn.simjuno.com${destination.locationLogo}`.replace(
                        ".png",
                        ".svg",
                      )}
                      alt=""
                      width={24}
                      height={24}
                      loading="lazy"
                      className="size-6 shrink-0 rounded-sm object-contain"
                    />
                    <span className="line-clamp-1">{destination.name}</span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums max-sm:hidden">
                      From ${(destination.from / 10000).toFixed(2)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
