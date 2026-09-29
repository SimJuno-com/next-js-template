"use client";

import type { ListInput } from "@next-js-template/api/types";
import { Button } from "@next-js-template/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@next-js-template/ui/components/dropdown-menu";
import { Input } from "@next-js-template/ui/components/input";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState, useTransition } from "react";

import { esimStatusLabels } from "../../_components/dashboard-ui";
import { EsimListSkeleton } from "./esim-list-skeleton";

const statuses = [
  { label: "All statuses", value: "" },
  ...Array.from(esimStatusLabels, ([value, label]) => ({ label, value: value.toLowerCase() })),
];

export function EsimList({
  children,
  filters,
  count,
}: {
  children: ReactNode;
  filters: Pick<ListInput, "s" | "status" | "limit">;
  count: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.s);
  const [status, setStatus] = useState(filters.status);
  const [pending, startTransition] = useTransition();
  const [waiting, setWaiting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const loading = waiting || pending;
  useEffect(() => () => clearTimeout(timer.current), []);
  // Like the orders table, don't let older responses overwrite edits during navigation.
  useEffect(() => {
    if (loading) return;
    setSearch(filters.s);
    setStatus(filters.status);
  }, [filters.s, filters.status, loading]);

  const selected = statuses.find((option) => option.value === status);
  const selectedLabel = selected?.label ?? status.replaceAll("_", " ");
  const filter = (s: string, status: string, delay = 300) => {
    setSearch(s);
    setStatus(status);
    clearTimeout(timer.current);
    setWaiting(true);
    const query = new URLSearchParams({
      ...(s.trim() && { s: s.trim() }),
      ...(status && { status }),
      limit: String(filters.limit),
      offset: "0",
    });
    timer.current = setTimeout(() => {
      startTransition(() => router.replace(`/dashboard/esim?${query}`, { scroll: false }));
      setWaiting(false);
    }, delay);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          aria-label="Search eSIMs"
          type="search"
          placeholder="Filter by eSIM ID, order ID, or package name…"
          maxLength={200}
          value={search}
          onChange={(event) => filter(event.target.value, status)}
          className="h-9 max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Status: ${selectedLabel}`}
            render={
              <Button
                type="button"
                variant="outline"
                className="h-9 min-w-40 justify-between gap-3"
              />
            }
          >
            {selectedLabel} <ChevronDown aria-hidden="true" className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-44">
            <DropdownMenuRadioGroup
              aria-label="eSIM status"
              value={status}
              onValueChange={(value) => filter(search, value, 0)}
            >
              {statuses.map(({ label, value }) => (
                <DropdownMenuRadioItem
                  key={value}
                  value={value}
                  closeOnClick
                  className="min-h-9 px-3"
                >
                  {label}
                </DropdownMenuRadioItem>
              ))}
              {!selected && (
                <DropdownMenuRadioItem value={status} closeOnClick className="min-h-9 px-3">
                  {selectedLabel}
                </DropdownMenuRadioItem>
              )}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <span role="status" className="sr-only">
        {loading ? "Loading eSIMs" : ""}
      </span>
      <div aria-busy={loading}>{loading ? <EsimListSkeleton count={count || 2} /> : children}</div>
    </>
  );
}
