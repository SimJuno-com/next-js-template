import { fulfillPayment } from "@next-js-template/api/lib/fulfillment";
import { getStripe, type Stripe } from "@next-js-template/api/lib/stripe";
import { env } from "@next-js-template/env/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing Stripe signature." }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      await request.text(),
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return Response.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.created":
      console.log("Stripe payment_intent.created", event.id, event.data.object.id);
      break;
    case "payment_intent.requires_action":
      console.log("Stripe payment_intent.requires_action", event.id, event.data.object.id);
      break;
    case "payment_intent.processing":
      console.log("Stripe payment_intent.processing", event.id, event.data.object.id);
      break;
    case "payment_intent.succeeded":
      console.log("Stripe payment_intent.succeeded", event.id, event.data.object.id);
      try {
        await fulfillPayment(event.data.object);
      } catch {
        console.error(
          "Stripe fulfillment failed; delivery can be retried",
          event.id,
          event.data.object.id,
        );
        return Response.json({ error: "Fulfillment could not be completed." }, { status: 500 });
      }
      break;
    case "payment_intent.payment_failed":
      console.log("Stripe payment_intent.payment_failed", event.id, event.data.object.id);
      break;
    case "payment_intent.canceled":
      console.log("Stripe payment_intent.canceled", event.id, event.data.object.id);
      break;
    case "payment_intent.amount_capturable_updated":
      console.log(
        "Stripe payment_intent.amount_capturable_updated",
        event.id,
        event.data.object.id,
      );
      break;
    default:
      console.log("Stripe event", event.type, event.id);
  }
  return Response.json({ received: true });
}
