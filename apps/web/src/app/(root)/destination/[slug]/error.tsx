"use client";

import { Button } from "@next-js-template/ui/components/button";
import Link from "next/link";

export default function DestinationPlansError({ retry }: { retry: () => void }) {
  return (
    <div className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
      <h1 className="text-3xl font-medium tracking-tight">Plans couldn’t load</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        We couldn’t get the latest plans for this destination. Please try again.
      </p>
      <Button type="button" onClick={retry} className="mt-6 h-11 px-5">
        Try again
      </Button>
      <Link
        href="/destination"
        className="mx-auto mt-6 block w-fit rounded px-3 py-2 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        Browse destinations
      </Link>
    </div>
  );
}
