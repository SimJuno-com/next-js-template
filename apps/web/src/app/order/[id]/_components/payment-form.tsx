"use client";

import { Button } from "@next-js-template/ui/components/button";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { LockKeyhole } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PaymentSkeleton } from "./payment-skeleton";

export function PaymentForm({
  orderId,
  amount,
  onSubmitted,
}: {
  orderId: string;
  amount: string;
  onSubmitted: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [loadFailed, setLoadFailed] = useState(false);
  const busy = useRef(false);

  useEffect(() => {
    if (ready) return;
    const timeout = setTimeout(() => setLoadFailed(true), 20_000);
    return () => clearTimeout(timeout);
  }, [ready]);

  if (loadFailed)
    return (
      <div className="space-y-4 text-center">
        <p role="alert" className="text-sm text-muted-foreground">
          Unable to load the payment form.
        </p>
        <Button type="button" onClick={onSubmitted}>
          Try again
        </Button>
      </div>
    );
  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !ready || busy.current) return;
        busy.current = true;
        setSubmitting(true);
        setError(undefined);
        try {
          const result = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/order/${orderId}` },
            redirect: "if_required",
          });
          if (result.error) {
            if (
              result.error.payment_intent?.status === "succeeded" ||
              result.error.code === "payment_intent_unexpected_state"
            ) {
              onSubmitted();
              return;
            }
            setError(
              result.error.message ?? "Your payment could not be completed. Please try again.",
            );
          } else {
            // The webhook verifies payment and fulfills the order, even if this page closes.
            onSubmitted();
          }
        } catch {
          // The charge may have succeeded before the connection dropped. Check it on the server.
          onSubmitted();
        } finally {
          busy.current = false;
          setSubmitting(false);
        }
      }}
    >
      {!ready && <PaymentSkeleton />}
      <PaymentElement onReady={() => setReady(true)} onLoadError={() => setLoadFailed(true)} />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        type="submit"
        className="h-12 w-full"
        disabled={!stripe || !elements || !ready || submitting}
        aria-busy={submitting}
      >
        {submitting ? "Confirming payment…" : `Pay ${amount}`}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <LockKeyhole aria-hidden="true" className="size-3.5" /> Secured by Stripe
      </p>
    </form>
  );
}
