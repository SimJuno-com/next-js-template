import { esimListInput } from "@next-js-template/api/contract";
import { Button } from "@next-js-template/ui/components/button";
import { ORPCError } from "@orpc/client";
import { ArrowRight, CardSim, ChevronLeft, ChevronRight, ReceiptText, Signal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { client } from "@/lib/orpc";
import { DashboardEmptyState, DashboardHeader } from "../_components/dashboard-ui";
import { EsimList } from "./_components/esim-list";
import { EsimIdentity, EsimUsage, getEsimPlan } from "./_components/esim-summary";
import { CardFrame } from "@/components/card-frame";

export const metadata: Metadata = { title: "eSIMs" };

export default async function EsimListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsed = esimListInput.safeParse(await searchParams);
  if (!parsed.success) notFound();
  const { s, status, limit, offset } = parsed.data;
  const { esims, pagination } = await client.esim.list(parsed.data).catch((error) => {
    if (error instanceof ORPCError && error.code === "UNAUTHORIZED") {
      redirect("/login?redirect_to=%2Fdashboard%2Fesim");
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
    return `/dashboard/esim?${query}` as const;
  };
  if (offset > 0 && offset >= pagination.total) {
    redirect(pageHref(Math.max(0, Math.floor((pagination.total - 1) / limit) * limit)));
  }
  const plans = new Map(
    await Promise.all(
      [...new Set(esims.map((esim) => esim.packageSlug))].map(
        async (slug) => [slug, await getEsimPlan(slug)] as const,
      ),
    ),
  );

  return (
    <>
      <DashboardHeader
        title="Your eSIMs"
        description="Your travel plans, all in one place. Check your data or get ready to connect."
      />
      <EsimList filters={{ s, status, limit }} count={esims.length}>
        {esims.length ? (
          <ul className="grid gap-4 sm:gap-6 xl:grid-cols-2">
            {esims.map((esim) => {
              const plan = plans.get(esim.packageSlug) ?? null;
              const ready = esim.status === "GOT_RESOURCE";
              return (
                <li key={esim.id}>
                  <CardFrame>
                    <div className="flex min-w-0 flex-col gap-6 bg-background p-5 text-foreground sm:p-6">
                      <EsimIdentity esim={esim} plan={plan} />
                      <EsimUsage esim={esim} plan={plan} />
                      <div className="mt-auto flex gap-2">
                        <Button
                          className="h-11 min-w-0 flex-1 gap-2"
                          render={<Link href={`/dashboard/esim/${esim.id}`} />}
                          nativeButton={false}
                          role="link"
                        >
                          {ready ? (
                            <Signal aria-hidden="true" className="size-4" />
                          ) : (
                            <ArrowRight aria-hidden="true" className="size-4" />
                          )}
                          {ready ? "Install eSIM" : "View details"}
                          <span className="sr-only"> for {esim.packageName}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-11"
                          aria-label={`View order for ${esim.packageName}`}
                          render={<Link href={`/order/${esim.order_id}`} />}
                          nativeButton={false}
                          role="link"
                        >
                          <ReceiptText aria-hidden="true" className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardFrame>
                </li>
              );
            })}
          </ul>
        ) : s || status ? (
          <div
            role="status"
            className="rounded-2xl border border-dashed bg-muted/30 px-5 py-12 text-center sm:px-6 sm:py-16"
          >
            <p className="font-medium">No eSIMs match your filters.</p>
            <Link
              href="/dashboard/esim"
              className="mt-3 inline-block text-sm underline underline-offset-4"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <DashboardEmptyState
            icon={CardSim}
            title="No eSIMs yet."
            description="Choose a plan for your next destination. Your eSIM and installation details will appear here after fulfillment."
          />
        )}
        <nav
          aria-label="eSIM pagination"
          className="mt-4 flex flex-wrap items-center justify-between gap-3"
        >
          <p role="status" className="text-sm text-muted-foreground tabular-nums">
            {esims.length ? `${offset + 1}–${offset + esims.length}` : "0"} of {pagination.total}{" "}
            eSIMs
          </p>
          <div className="flex gap-2">
            {offset > 0 ? (
              <Button
                variant="outline"
                className="h-9"
                render={<Link href={pageHref(Math.max(0, offset - limit))} scroll={false} />}
                nativeButton={false}
                role="link"
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
                role="link"
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
      </EsimList>
    </>
  );
}
