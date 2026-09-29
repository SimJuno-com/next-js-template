"use client";

import { Button } from "@next-js-template/ui/components/button";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { CardFrame } from "@/components/card-frame";

export default function EsimError({ retry }: { retry: () => void }) {
  return (
    <CardFrame>
      <div className="mx-auto max-w-lg space-y-6 px-5 py-12 text-center sm:px-6 sm:py-16">
        <CircleAlert aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
        <h1 className="text-2xl font-medium tracking-tight">eSIMs couldn’t load</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          We couldn’t get your latest eSIM details. Please try again.
        </p>
        <Button variant="outline" className="h-11 px-5" onClick={retry}>
          Try again
        </Button>
        <Link href="/dashboard/esim" className="block text-sm underline underline-offset-4">
          All your eSIMs
        </Link>
      </div>
    </CardFrame>
  );
}
