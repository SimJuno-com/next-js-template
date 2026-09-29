import Link from "next/link";
import { buttonVariants } from "@next-js-template/ui/components/button";
import { cn } from "@next-js-template/ui/lib/utils";
import { CardFrame } from "@/components/card-frame";

export default function OrderNotFound() {
  return (
    <CardFrame>
      <div className="space-y-6 px-5 py-12 text-center sm:px-6 sm:py-16">
        <h1 className="text-2xl font-medium tracking-tight">Order not found</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Check that you opened the complete order link.
        </p>
        <Link href="/destination" className={cn(buttonVariants({ className: "h-11 w-full" }))}>
          Browse destinations
        </Link>
      </div>
    </CardFrame>
  );
}
