"use client";

import type { AppRouterClient } from "@next-js-template/api/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Order = Awaited<ReturnType<AppRouterClient["order"]["get"]>>;

export function OrderProgress({ orderId, status }: { orderId: string; status: Order["status"] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const [redirecting, setRedirecting] = useState(false);
  const shouldRedirect = useRef(status !== "Completed");

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const signal = () => AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]);
    async function poll() {
      try {
        const response = await fetch(`/api/rpc/order/${encodeURIComponent(orderId)}`, {
          credentials: "include",
          cache: "no-store",
          signal: signal(),
        });
        if (!response.ok) throw new Error("Unable to refresh your order. Retrying shortly.");
        const latest: Order = await response.json();
        if (latest.status !== "Awaiting payment") {
          // Exchange the checkout proof only after the webhook has created the owner.
          const claim = () =>
            fetch("/api/auth/checkout/claim", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId }),
              signal: signal(),
            });
          const session = await claim();
          if (session.status === 409) {
            setMessage(
              "This checkout belongs to a different account. Sign out before recovering it.",
            );
            return;
          }
          if (!session.ok) throw new Error("Your payment is saved. Reconnecting your account…");
          const handoff: { ready: boolean; signedIn: boolean } = await session.json();
          if (!handoff.ready) throw new Error("Your payment is saved. Reconnecting your account…");
          if (handoff.signedIn) {
            shouldRedirect.current = true;
            // Confirm receipt of the login cookie before revoking the temporary proof.
            const confirmed = await claim();
            if (!confirmed.ok) throw new Error("Your payment is saved. Reconnecting your account…");
          }
        }
        if (controller.signal.aborted) return;
        setMessage(undefined);
        if (latest.status !== status) router.refresh();
        if (latest.status === "Completed" && latest.esim_id) {
          // Redirect a finishing checkout, but let customers revisit their receipt.
          if (shouldRedirect.current) {
            setRedirecting(true);
            timer = setTimeout(() => {
              window.location.replace(`/dashboard/esim/${encodeURIComponent(latest.esim_id!)}`);
            }, 1500);
          }
          return;
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setMessage(error instanceof Error ? error.message : "Unable to refresh your order.");
      }
      if (!controller.signal.aborted) timer = setTimeout(poll, 3000);
    }
    void poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [orderId, status, router]);

  return message || redirecting ? (
    <p role="status" className="mt-4 text-center text-sm text-muted-foreground">
      {message ?? "Opening your eSIM…"}
    </p>
  ) : null;
}
