import { orderListInput } from "@next-js-template/api/contract";
import { Button } from "@next-js-template/ui/components/button";
import { ORPCError } from "@orpc/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { client } from "@/lib/orpc";
import { DashboardHeader } from "../_components/dashboard-ui";
import { OrdersTable } from "../_components/orders-table";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  if (params.id !== undefined && typeof params.id !== "string") notFound();
  if (params.id) redirect(`/order/${encodeURIComponent(params.id)}`);

  const parsed = orderListInput.safeParse(params);
  if (!parsed.success) notFound();
  const { s, status, limit, offset } = parsed.data;
  const { orders, pagination } = await client.order.listOrder(parsed.data).catch((error) => {
    if (error instanceof ORPCError && error.code === "UNAUTHORIZED") {
      redirect("/login?redirect_to=%2Fdashboard%2Forders");
    }
    throw error;
  });
  const pageHref = (offset: number) => {
    const query = new URLSearchParams({
      ...(s && { s }),
      ...(status && { status }),
      limit: String(limit),
      offset: String(offset),
    });
    return `/dashboard/orders?${query}` as const;
  };
  if (offset > 0 && offset >= pagination.total) {
    redirect(pageHref(Math.max(0, Math.floor((pagination.total - 1) / limit) * limit)));
  }

  return (
    <>
      <DashboardHeader
        title="Orders"
        description="Your purchases and receipts, newest first. Search by order ID or package name."
      />
      <OrdersTable orders={orders} filters={{ s, status, limit }} />
      <nav
        aria-label="Order pagination"
        className="mt-4 flex flex-wrap items-center justify-between gap-3"
      >
        <p role="status" className="text-sm text-muted-foreground tabular-nums">
          {orders.length ? `${offset + 1}–${offset + orders.length}` : "0"} of {pagination.total}{" "}
          orders
        </p>
        <div className="flex gap-2">
          {offset > 0 ? (
            <Button
              variant="outline"
              className="h-9"
              render={<Link href={pageHref(Math.max(0, offset - limit))} scroll={false} />}
              nativeButton={false}
            >
              <ChevronLeft aria-hidden="true" /> Previous
            </Button>
          ) : (
            <Button variant="outline" className="h-9" disabled>
              <ChevronLeft aria-hidden="true" /> Previous
            </Button>
          )}
          {pagination.hasMore ? (
            <Button
              variant="outline"
              className="h-9"
              render={<Link href={pageHref(offset + limit)} scroll={false} />}
              nativeButton={false}
            >
              Next <ChevronRight aria-hidden="true" />
            </Button>
          ) : (
            <Button variant="outline" className="h-9" disabled>
              Next <ChevronRight aria-hidden="true" />
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}
