import { ORPCError } from "@orpc/client";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReceiptText } from "lucide-react";

import { CardFrame } from "@/components/card-frame";
import { CopyButton } from "@/components/copy-button";
import { TemplateNotice } from "@/components/template-notice";
import { client } from "@/lib/orpc";
import { formatOrderPrice } from "@/lib/plan-display";
import { OrderReference } from "./_components/order-reference";
import { BackButton } from "./_components/back-button";
import { EmbeddedPayment } from "./_components/embedded-payment";
import { OrderProgress } from "./_components/order-progress";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await client.order.get({ id }).catch((error) => {
    if (error instanceof ORPCError && error.code === "NOT_FOUND") notFound();
    throw error;
  });
  const awaitingPayment = order.status === "Awaiting payment";
  const amount = formatOrderPrice(order);

  return (
    <>
      <h1 className="mb-6 text-2xl leading-tight font-medium tracking-[-0.045em]">
        {order.packageName}
      </h1>
      <div className="mb-6">
        <BackButton />
      </div>
      <CardFrame>
        <article className="text-foreground">
          <div className="px-5 py-6 sm:px-6 sm:py-8">
            <header className="text-center">
              <ReceiptText className="mx-auto mb-6 size-10" aria-hidden="true" />
              <h2 className="text-xl font-medium tracking-tight">
                {awaitingPayment
                  ? "Complete your order"
                  : order.status === "Completed"
                    ? "Order complete"
                    : "Preparing your eSIM"}
              </h2>
              <p className="mt-3 text-4xl font-semibold tracking-tight tabular-nums">
                {amount}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {order.currencyCode}
                </span>
              </p>
            </header>
            {awaitingPayment && (
              <TemplateNotice
                title="Stripe test mode"
                description="This template runs in Stripe test mode. Pay with this test card."
              >
                <div className="space-y-2">
                  <dl className="relative rounded-lg bg-muted/60 py-2 pr-14 pl-3">
                    <dt className="text-xs text-muted-foreground">Card number</dt>
                    <dd className="font-mono text-sm tabular-nums">
                      4242 4242 4242 4242
                      <CopyButton
                        text="4242424242424242"
                        aria-label="Copy test card number"
                        variant="ghost"
                        className="absolute top-1/2 right-1.5 size-10 -translate-y-1/2"
                      />
                    </dd>
                  </dl>
                  <dl className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-muted/60 px-3 py-2">
                      <dt className="text-xs text-muted-foreground">Expiry</dt>
                      <dd className="text-sm">Any future date</dd>
                    </div>
                    <div className="rounded-lg bg-muted/60 px-3 py-2">
                      <dt className="text-xs text-muted-foreground">CVC</dt>
                      <dd className="text-sm">Any 3 digits</dd>
                    </div>
                  </dl>
                </div>
              </TemplateNotice>
            )}
            {awaitingPayment && (
              <section aria-label="Payment options" className="mt-8">
                <EmbeddedPayment orderId={order.order_id} amount={amount} />
              </section>
            )}
            {order.esim_id && (
              <div className="mt-6 space-y-3 text-center">
                <p className="text-sm text-muted-foreground">
                  eSIM ID: <span className="font-mono break-all select-all">{order.esim_id}</span>
                </p>
                <Link
                  href={`/dashboard/esim/${order.esim_id}`}
                  className="inline-block font-medium text-primary underline underline-offset-4"
                >
                  View your eSIM
                </Link>
              </div>
            )}
            <OrderProgress key={order.order_id} orderId={order.order_id} status={order.status} />
          </div>
          <footer className="border-t bg-muted/30 p-5 sm:p-6">
            <OrderReference id={order.order_id} />
          </footer>
        </article>
      </CardFrame>
      <Link
        href="/destination"
        className="mx-auto mt-6 block w-fit text-xs text-muted-foreground hover:text-foreground"
      >
        Continue exploring
      </Link>
    </>
  );
}
