"use client";

import type { AppRouterClient } from "@next-js-template/api/types";
import { env } from "@next-js-template/env/web";
import { Button } from "@next-js-template/ui/components/button";
import { Elements } from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import { useEffect, useState } from "react";

import { usePaymentAppearance } from "./payment-appearance";
import { PaymentForm } from "./payment-form";
import { PaymentSkeleton } from "./payment-skeleton";

type Payment = Awaited<ReturnType<AppRouterClient["order"]["paymentIntent"]>>;
type PaymentState =
  | { phase: "loading" }
  | { phase: "processing" }
  | { phase: "error"; message: string }
  | { phase: "ready"; stripe: Stripe; clientSecret: string };

let stripePromise: Promise<Stripe | null> | undefined;
function getStripe(key: string) {
  return (stripePromise ??= loadStripe(key)
    .then((stripe) => {
      if (!stripe) stripePromise = undefined;
      return stripe;
    })
    .catch((error: unknown) => {
      stripePromise = undefined;
      throw error;
    }));
}

export function EmbeddedPayment({ orderId, amount }: { orderId: string; amount: string }) {
  const { appearance, fonts } = usePaymentAppearance();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<PaymentState>({ phase: "loading" });
  const retry = () => setAttempt((value) => value + 1);

  useEffect(() => {
    let active = true;
    setState({ phase: "loading" });
    // 3DS may return a client secret in the URL. Only the saved intent on the backend is trusted.
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);

    async function loadPayment() {
      try {
        const response = await fetch(
          `/api/rpc/order/${encodeURIComponent(orderId)}/payment-intent`,
          {
            method: "POST",
            credentials: "include",
            signal: AbortSignal.timeout(30_000),
          },
        );
        if (!response.ok) throw new Error("Unable to load or verify payment. Please try again.");
        const payment: Payment = await response.json();
        if (!active) return;
        if (payment.status === "succeeded" || payment.status === "processing") {
          // OrderProgress waits for the webhook; never finalize payment in the browser.
          setState({ phase: "processing" });
          return;
        }
        if (!payment.clientSecret) {
          throw new Error(
            payment.status === "canceled"
              ? "This payment was canceled. Please choose a plan to start a new order."
              : "Your payment is processing. Please check again shortly.",
          );
        }
        const stripe = await getStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) throw new Error("Unable to load secure payment. Please try again.");
        if (active) setState({ phase: "ready", stripe, clientSecret: payment.clientSecret });
      } catch (error) {
        if (active)
          setState({
            phase: "error",
            message:
              error instanceof Error ? error.message : "Unable to load payment. Please try again.",
          });
      }
    }
    void loadPayment();
    return () => {
      active = false;
    };
  }, [orderId, attempt]);

  if (state.phase === "processing")
    return (
      <p role="status" className="text-center text-sm text-muted-foreground">
        Confirming your payment and preparing your eSIM…
      </p>
    );
  if (state.phase === "error")
    return (
      <div className="space-y-4 text-center">
        <p role="status" className="text-sm text-muted-foreground">
          {state.message}
        </p>
        <Button type="button" onClick={retry}>
          Check again
        </Button>
      </div>
    );
  if (state.phase === "loading" || !appearance) return <PaymentSkeleton />;
  return (
    <Elements
      stripe={state.stripe}
      options={{ clientSecret: state.clientSecret, appearance, fonts }}
    >
      <PaymentForm orderId={orderId} amount={amount} onSubmitted={retry} />
    </Elements>
  );
}
