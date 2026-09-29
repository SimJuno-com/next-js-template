import { db, generateId } from "@next-js-template/db";
import { user } from "@next-js-template/db/schema/auth";
import { esim } from "@next-js-template/db/schema/esim";
import { order } from "@next-js-template/db/schema/order";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { stripeAmount } from "./payment-amount";
// import { simjuno } from "./simjuno";
import type { Stripe } from "./stripe";

const fulfilledOrder = z.object({
  transaction_id: z.string(),
  esim_ids: z.array(z.string().min(1)).length(1),
});

export async function fulfillPayment(intent: Stripe.PaymentIntent) {
  const orderId = intent.metadata.order_id;
  if (!orderId) return;

  await db.transaction(async (tx) => {
    const [saved] = await tx.select().from(order).where(eq(order.id, orderId)).for("update");
    if (
      !saved ||
      intent.status !== "succeeded" ||
      saved.stripePaymentIntentId !== intent.id ||
      intent.amount !== stripeAmount(saved.price, saved.currencyCode) ||
      intent.amount_received !== intent.amount ||
      intent.currency !== saved.currencyCode.toLowerCase()
    ) {
      throw new Error("The successful payment does not match the saved order.");
    }
    if (saved.status === "Completed") return;
    let userId = saved.userId;
    if (!userId) {
      userId = generateId();
      await tx.insert(user).values({
        id: userId,
        name: "Guest",
        email: `guest-${userId}@checkout.invalid`,
        emailVerified: false,
        isAnonymous: true,
      });
    }
    await tx
      .update(order)
      .set({
        userId,
        status: "Processing",
        paidAt: saved.paidAt ?? new Date(),
      })
      .where(eq(order.id, saved.id));
  });

  await fulfillOrder(orderId);
}

async function fulfillOrder(orderId: string) {
  await db.transaction(async (tx) => {
    const [saved] = await tx.select().from(order).where(eq(order.id, orderId)).for("update");
    if (!saved || !saved.paidAt || !saved.userId) throw new Error("Order is not paid.");
    if (saved.status === "Completed") return;

    // TODO: swap the dummy below for the real SimJuno purchase.
    // const result = fulfilledOrder.parse(
    //   await simjuno.esim.orderEsim(
    //     {
    //       transaction_id: saved.id,
    //       orderList: [{ slug: saved.packageSlug, count: 1 }],
    //     },
    //     { timeoutInSeconds: 15, maxRetries: 0 },
    //   ),
    // );
    const result = fulfilledOrder.parse({
      transaction_id: saved.id,
      esim_ids: [`dummy-esim-${saved.id}`],
    });
    if (result.transaction_id !== saved.id) throw new Error("Provider transaction mismatch.");

    await tx.insert(esim).values({ orderId: saved.id, providerEsimId: result.esim_ids[0]! });
    await tx.update(order).set({ status: "Completed" }).where(eq(order.id, saved.id));
  });
}
