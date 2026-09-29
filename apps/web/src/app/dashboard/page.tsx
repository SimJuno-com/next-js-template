import { auth } from "@next-js-template/auth";
import { ArrowRight, CardSim, Clock3, ReceiptText } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { client } from "@/lib/orpc";
import { DashboardHeader } from "./_components/dashboard-ui";
import { OrdersTable } from "./_components/orders-table";
import { CardFrame } from "@/components/card-frame";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const [{ orders }, stats] = await Promise.all([
    client.order.listOrder({ limit: 3 }),
    client.order.stats(),
  ]);

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description={
          session.user.isAnonymous
            ? "Welcome. Your travel connections, all in one place."
            : `Welcome back, ${session.user.name}`
        }
      />
      <dl className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {(
          [
            {
              label: "Your eSIMs",
              value: stats.esims,
              icon: CardSim,
              note: "View installation & usage",
              href: "/dashboard/esim",
            },
            {
              label: "Total orders",
              value: stats.totalOrders,
              icon: ReceiptText,
              note: "View your order history",
              href: "/dashboard/orders",
            },
            {
              label: "Awaiting payment",
              value: stats.awaitingPayment,
              icon: Clock3,
              note: "Review your orders",
              href: "/dashboard/orders?status=awaiting+payment",
            },
          ] as const
        ).map(({ label, value, icon: Icon, note, href }) => (
          <CardFrame key={label}>
            <div className="relative bg-background p-5 sm:p-6">
              <dt className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                {label}
                <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </dt>
              <dd className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</dd>
              <dd className="mt-4">
                <Link
                  href={href}
                  className="inline-flex min-h-6 items-center gap-1.5 text-xs text-muted-foreground after:absolute after:inset-0 after:rounded-2xl hover:text-foreground focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
                >
                  {note} <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              </dd>
            </div>
          </CardFrame>
        ))}
      </dl>
      <section aria-labelledby="recent-orders-heading" className="mt-8 sm:mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="recent-orders-heading" className="text-xl font-medium tracking-tight">
            Recent orders
          </h2>
          <Link
            href="/dashboard/orders"
            className="inline-flex min-h-9 items-center gap-2 rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            View all orders <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <OrdersTable orders={orders} />
      </section>
    </>
  );
}
