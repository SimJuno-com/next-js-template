import { env } from "@next-js-template/env/server";
import Stripe from "stripe";

export type { Stripe };

let stripe: Stripe | undefined;

// Returns the shared Stripe client, creating it on first use.
export function getStripe() {
  return (stripe ??= new Stripe(env.STRIPE_SECRET_KEY, { timeout: 15_000, maxNetworkRetries: 2 }));
}
