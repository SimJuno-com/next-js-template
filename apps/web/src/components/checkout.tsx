"use client";

import { Button } from "@next-js-template/ui/components/button";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext, use, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

const CheckoutContext = createContext<{
  buyNow: (packageSlug: string) => Promise<void>;
  isCreatingOrder: boolean;
} | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  // Desktop and mobile buttons share a lock, including while navigation is pending.
  const creatingOrder = useRef(false);

  async function buyNow(packageSlug: string) {
    if (creatingOrder.current) return;
    creatingOrder.current = true;
    setIsCreatingOrder(true);
    try {
      const response = await fetch("/api/rpc/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packageSlug }),
      });
      if (response.status !== 201) throw new Error("Unable to create order");
      const { order_id } = await response.json();
      if (typeof order_id !== "string" || !order_id) throw new Error("Invalid order response");
      router.push(`/order/${encodeURIComponent(order_id)}`);
    } catch {
      creatingOrder.current = false;
      setIsCreatingOrder(false);
      toast.error("Unable to create your order. Please try again.");
    }
  }

  return <CheckoutContext value={{ buyNow, isCreatingOrder }}>{children}</CheckoutContext>;
}

export function BuyNowButton({
  packageSlug,
  className,
}: {
  packageSlug: string;
  className?: string;
}) {
  const checkout = use(CheckoutContext);
  if (!checkout) throw new Error("BuyNowButton requires a CheckoutProvider");

  const { buyNow, isCreatingOrder } = checkout;
  return (
    <Button
      type="button"
      className={className}
      disabled={isCreatingOrder}
      aria-busy={isCreatingOrder}
      onClick={() => buyNow(packageSlug)}
    >
      {isCreatingOrder ? "Creating order…" : "Buy Now"}
      {isCreatingOrder ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <ArrowRight className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
