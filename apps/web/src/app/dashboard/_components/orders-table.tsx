"use client";

import type { AppRouterClient } from "@next-js-template/api/types";
import { Button } from "@next-js-template/ui/components/button";
import { Input } from "@next-js-template/ui/components/input";
import { Skeleton } from "@next-js-template/ui/components/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@next-js-template/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@next-js-template/ui/components/table";
import {
  columnFilteringFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { formatOrderPrice } from "@/lib/plan-display";
import { StatusBadge } from "./dashboard-ui";
import { CardFrame } from "@/components/card-frame";

type Order = Awaited<ReturnType<AppRouterClient["order"]["listOrder"]>>["orders"][number];
// Filtering, ordering, and pagination happen in the API, never on just the visible rows.
const features = tableFeatures({ columnFilteringFeature });
const column = createColumnHelper<typeof features, Order>();
const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });
const time = new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "UTC" });
const columns = column.columns([
  column.accessor("packageName", {
    header: "Order",
    cell: ({ row: { original: order } }) => (
      <Link
        href={`/order/${order.order_id}`}
        className="block rounded-sm outline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <span className="block max-w-72 font-medium whitespace-normal">{order.packageName}</span>
        <span className="mt-1 block font-mono text-xs text-muted-foreground">{order.order_id}</span>
      </Link>
    ),
  }),
  column.accessor("createdAt", {
    header: "Created (UTC)",
    cell: ({ row }) => (
      <time dateTime={row.original.createdAt}>
        <span className="block">{date.format(new Date(row.original.createdAt))}</span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {time.format(new Date(row.original.createdAt))}
        </span>
      </time>
    ),
  }),
  column.accessor("status", {
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  }),
  column.accessor("price", {
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">{formatOrderPrice(row.original)}</div>
    ),
  }),
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <Link
        href={`/order/${row.original.order_id}`}
        aria-label={`View order ${row.original.order_id}`}
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </Link>
    ),
  }),
]);

const statuses = [
  "All statuses",
  "Awaiting payment",
  "Payment received",
  "Processing",
  "Completed",
].map((label, index) => ({ label, value: index === 0 ? "" : label.toLowerCase() }));

function FilterToolbar({
  search,
  status,
  limit,
  onSearchChange,
  onStatusChange,
  onLoadingChange,
}: {
  search: string;
  status: string;
  limit: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onLoadingChange: (loading: boolean) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [waiting, setWaiting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => onLoadingChange(waiting || pending), [waiting, pending, onLoadingChange]);
  const selectedLabel = statuses.find((option) => option.value === status)?.label;
  const filter = (s: string, status: string, delay = 300) => {
    clearTimeout(timer.current);
    setWaiting(true);
    onLoadingChange(true);
    const query = new URLSearchParams({
      ...(s.trim() && { s: s.trim() }),
      ...(status && { status }),
      limit: String(limit),
      offset: "0",
    });
    timer.current = setTimeout(() => {
      startTransition(() => router.replace(`/dashboard/orders?${query}`, { scroll: false }));
      setWaiting(false);
    }, delay);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <Input
        aria-label="Search orders"
        type="search"
        placeholder="Filter by order ID or package name…"
        maxLength={200}
        value={search}
        onChange={(event) => {
          onSearchChange(event.target.value);
          filter(event.target.value, status);
        }}
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
            aria-label="Order status"
            value={status}
            onValueChange={(value) => {
              onStatusChange(value);
              filter(search, value, 0);
            }}
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
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function OrdersTable({
  orders,
  filters,
}: {
  orders: Order[];
  filters?: { s: string; status: string; limit: number };
}) {
  const s = filters?.s ?? "";
  const status = filters?.status ?? "";
  const [loading, setLoading] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "packageName", value: s },
    { id: "status", value: status },
  ]);
  // Older responses must not overwrite edits made during the debounce or navigation.
  useEffect(() => {
    if (loading) return;
    setColumnFilters((current) => {
      const search = (current.find((filter) => filter.id === "packageName")?.value as string) ?? "";
      const selected = current.find((filter) => filter.id === "status")?.value ?? "";
      if (search.trim() === s && selected === status) return current;
      return [
        { id: "packageName", value: s },
        { id: "status", value: status },
      ];
    });
  }, [s, status, loading]);
  const table = useTable({
    features,
    columns,
    data: orders,
    getRowId: (order) => order.order_id,
    manualFiltering: true,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
  });
  const filtered = Boolean(s || status);

  return (
    <>
      {filters && (
        <FilterToolbar
          search={(table.getColumn("packageName")?.getFilterValue() as string) ?? ""}
          status={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          limit={filters.limit}
          onSearchChange={(value) => table.getColumn("packageName")?.setFilterValue(value)}
          onStatusChange={(value) => table.getColumn("status")?.setFilterValue(value)}
          onLoadingChange={setLoading}
        />
      )}
      <span role="status" className="sr-only">
        {loading ? "Loading orders" : ""}
      </span>

      <CardFrame>
        <Table aria-label="Orders, newest first" className="min-w-[640px] bg-background">
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    scope="col"
                    aria-sort={header.column.id === "createdAt" ? "descending" : undefined}
                    className="px-4 text-xs text-muted-foreground"
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: orders.length || 3 }, (_, index) => (
                <TableRow key={index} aria-hidden="true">
                  {columns.map((_, cell) => (
                    <TableCell key={cell} className="px-4 py-4">
                      <Skeleton className="h-9 w-full min-w-8 motion-reduce:animate-none" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-4">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <p className="font-medium">
                    {filtered ? "No orders match your filters." : "No orders yet."}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {filtered ? (
                      "Try another order ID, package name, or status."
                    ) : (
                      <Link href="/destination" className="underline underline-offset-4">
                        Browse plans
                      </Link>
                    )}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardFrame>
    </>
  );
}
