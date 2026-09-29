import { canAccessOrder } from "@next-js-template/auth/checkout-access";
import { db } from "@next-js-template/db";
import { order } from "@next-js-template/db/schema/order";
import { eq } from "drizzle-orm";

import { stripeAmount } from "../lib/payment-amount";
import { getStripe } from "../lib/stripe";
import { optionalAuthRoute } from "./base";

// Creates or reuses the Stripe payment intent for an accessible order.
export const paymentIntent = optionalAuthRoute.order.paymentIntent.handler(
  async ({ input, context, errors }) => {
    return db.transaction(async (tx) => {
      // Serialize page reloads and payment retries for this order.
      const [saved] = await tx.select().from(order).where(eq(order.id, input.id)).for("update");
      if (!saved || !canAccessOrder(saved, context)) {
        throw errors.NOT_FOUND();
      }
      if (saved.status !== "Awaiting payment") {
        return { status: "succeeded" as const, clientSecret: null };
      }

      const stripe = getStripe();
      const amount = stripeAmount(saved.price, saved.currencyCode);
      const intent = saved.stripePaymentIntentId
        ? await stripe.paymentIntents.retrieve(saved.stripePaymentIntentId)
        : await stripe.paymentIntents.create(
            {
              amount,
              currency: saved.currencyCode.toLowerCase(),
              description: saved.packageName,
              metadata: {
                order_id: saved.id,
                package_slug: saved.packageSlug,
                package_name: saved.packageName.slice(0, 500),
                // Store the order price in currency units, not Simjuno's 1/10,000 units.
                price: String(saved.price / 10_000),
                currency_code: saved.currencyCode,
                ...(saved.userId ? { user_id: saved.userId } : {}),
              },
              payment_method_types: ["card"],
            },
            { idempotencyKey: `order:${saved.id}:payment-intent` },
          );
      if (
        intent.metadata.order_id !== saved.id ||
        intent.amount !== amount ||
        intent.currency !== saved.currencyCode.toLowerCase() ||
        (saved.stripePaymentIntentId && intent.id !== saved.stripePaymentIntentId)
      ) {
        throw new Error("The payment does not match this order.");
      }
      if (!saved.stripePaymentIntentId) {
        await tx
          .update(order)
          .set({ stripePaymentIntentId: intent.id })
          .where(eq(order.id, saved.id));
      }

      // Only the signed Stripe webhook records payment and starts fulfillment.
      const payable = [
        "requires_payment_method",
        "requires_confirmation",
        "requires_action",
      ].includes(intent.status);
      if (payable && !intent.client_secret) throw new Error("Payment details are unavailable.");
      return { status: intent.status, clientSecret: payable ? intent.client_secret : null };
    });
  },
);
