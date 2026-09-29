"use client";

import { ArrowDownWideNarrow, ChevronDown, ChevronRight, SearchX } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { Button } from "@next-js-template/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@next-js-template/ui/components/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@next-js-template/ui/components/tabs";
import type { SimjunoDestinationGroupKey } from "@next-js-template/api/types";

import { CardFrame } from "@/components/card-frame";

import { useDestinations } from "@/hooks/use-destination-data";
import { DestinationPagination } from "./_components/destination-pagination";
import { DestinationSearchForm } from "./_components/destination-search-form";
import { categories, filterDestinations, PAGE_SIZE } from "@/lib/destination-search";

export default function DestinationsPage() {
  const destinations = useDestinations();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SimjunoDestinationGroupKey>("Country");
  const [sort, setSort] = useState<"popular" | "alphabetical">("popular");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const filtered = {
    Country: filterDestinations(destinations.Country, query),
    Region: filterDestinations(destinations.Region, query),
    Global: filterDestinations(destinations.Global, query),
  };

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
    if (filterDestinations(destinations[category], value).length === 0) {
      const match = categories.find(
        (tab) => filterDestinations(destinations[tab.key], value).length > 0,
      );
      if (match) setCategory(match.key);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8">
      <section className="py-12 sm:py-16 lg:py-20 flex flex-col items-center text-center">
        <h1 className="text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.045em] text-balance text-foreground">
          Browse{" "}
          <span className="font-serif text-[1.05em] tracking-[-0.035em] text-primary italic">
            destinations
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-pretty text-muted-foreground">
          Search by country, region, or global plan and choose a data plan.
        </p>
        <DestinationSearchForm
          className="mt-8 sm:mt-10"
          placeholder="Search destination..."
          buttonLabel="Search"
          value={query}
          onValueChange={updateQuery}
          resultsId="destination-results"
          onSearch={() => {
            resultsRef.current?.scrollIntoView({ block: "start" });
            resultsRef.current?.focus({ preventScroll: true });
          }}
        />
      </section>

      <section aria-label="Browse destinations" className="pb-12 sm:pb-16 lg:pb-20">
        <Tabs
          value={category}
          onValueChange={(value) => {
            setCategory(value as SimjunoDestinationGroupKey);
            setPage(1);
          }}
          className="gap-0"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TabsList
              aria-label="Destination types"
              className="max-w-full rounded-xl border bg-muted/50 p-1 group-data-horizontal/tabs:h-auto"
            >
              {categories.map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="min-h-10 gap-1 rounded-lg px-2 py-2 text-[11px] min-[375px]:px-3 min-[375px]:text-xs sm:px-5 sm:text-sm"
                >
                  {tab.label}{" "}
                  <span className="inline-block w-[5ch] tabular-nums">
                    ({filtered[tab.key].length})
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" className="ml-auto h-11 gap-2 px-5" />}
                aria-label={`Sort destinations: ${sort === "popular" ? "Popular" : "A–Z"}`}
              >
                <ArrowDownWideNarrow aria-hidden="true" />
                <span>Sort: {sort === "popular" ? "Popular" : "A–Z"}</span>
                <ChevronDown aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value as "popular" | "alphabetical");
                    setPage(1);
                  }}
                >
                  <DropdownMenuRadioItem value="popular" className="min-h-11 py-2.5 pl-3">
                    Popular
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="alphabetical" className="min-h-11 py-2.5 pl-3">
                    A–Z
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div
            id="destination-results"
            ref={resultsRef}
            tabIndex={-1}
            className="mt-8 scroll-mt-24 sm:mt-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <p role="status" className="sr-only">
              {`${filtered[category].length} ${categories.find((tab) => tab.key === category)?.label.toLowerCase()} found${query.trim() ? ` for ${query}` : ""}. Page ${page} of ${Math.max(1, Math.ceil(filtered[category].length / PAGE_SIZE))}.`}
            </p>
            {categories.map((tab) => {
              const items =
                sort === "alphabetical"
                  ? [...filtered[tab.key]].sort((a, b) =>
                      a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
                    )
                  : filtered[tab.key];

              const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
              const currentPage = Math.min(page, pageCount);
              const start = (currentPage - 1) * PAGE_SIZE;
              const visibleItems = items.slice(start, start + PAGE_SIZE);

              return (
                <TabsContent key={tab.key} value={tab.key}>
                  {items.length > 0 ? (
                    <>
                      <ul className="gap-4 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleItems.map((destination) => (
                          <li key={destination.slug}>
                            <CardFrame>
                              <Link
                                href={`/destination/${destination.slug}`}
                                prefetch={false}
                                className="group flex min-h-20 items-center gap-4 bg-background px-5 py-4 text-foreground transition-colors duration-150 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary sm:px-6"
                              >
                                <img
                                  src={`https://cdn.simjuno.com${destination.locationLogo}`.replace(
                                    /\.png$/,
                                    ".svg",
                                  )}
                                  alt=""
                                  width={40}
                                  height={30}
                                  loading="lazy"
                                  className="h-[30px] w-10 shrink-0 rounded-sm object-cover"
                                />
                                <span className="line-clamp-2 min-w-0 flex-1 text-base font-medium">
                                  {destination.name}
                                </span>
                                <ChevronRight
                                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                                  aria-hidden="true"
                                />
                              </Link>
                            </CardFrame>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 flex min-h-24 flex-col items-center justify-between gap-4 sm:min-h-11 sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                          Showing{" "}
                          <span className="font-medium text-foreground">
                            {start + 1}–{Math.min(start + PAGE_SIZE, items.length)}
                          </span>{" "}
                          of {items.length} {tab.label.toLowerCase()}
                        </p>
                        {pageCount > 1 && (
                          <DestinationPagination
                            page={currentPage}
                            pageCount={pageCount}
                            onPageChange={(nextPage) => {
                              setPage(nextPage);
                              resultsRef.current?.scrollIntoView({ block: "start" });
                              resultsRef.current?.focus({ preventScroll: true });
                            }}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed bg-muted/30 px-5 py-12 text-center sm:px-6 sm:py-16">
                      <SearchX
                        className="mx-auto mb-4 size-8 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <h2 className="text-lg font-medium">No {tab.label.toLowerCase()} found</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {query.trim()
                          ? "Try another destination or browse a different tab."
                          : "Please check back soon for available destinations."}
                      </p>
                      {query && (
                        <button
                          type="button"
                          onClick={() => updateQuery("")}
                          className="mt-5 rounded-md px-3 py-2 text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </section>
    </div>
  );
}
