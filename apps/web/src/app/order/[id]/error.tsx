"use client";

import Link from "next/link";
import { Button } from "@next-js-template/ui/components/button";
import { CardFrame } from "@/components/card-frame";

export default function OrderError({ retry }: { retry: () => void }) {
  return (
    <CardFrame>
      <div className="space-y-6 px-5 py-12 text-center sm:px-6 sm:py-16">
        <h1 className="text-2xl font-medium tracking-tight">Order couldn’t load</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Please try again to check this order’s latest status.
        </p>
        <Button onClick={retry} className="h-11 w-full">
          Try again
        </Button>
        <Link href="/destination" className="block text-sm underline underline-offset-4">
          Browse destinations
        </Link>
      </div>
    </CardFrame>
  );
}
