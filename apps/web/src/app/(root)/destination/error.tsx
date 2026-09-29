"use client";

import { Button } from "@next-js-template/ui/components/button";

export default function DestinationError({ retry }: { retry: () => void }) {
  return (
    <div className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
      <h1 className="text-3xl font-medium tracking-tight">Destinations couldn’t load</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Please try again to find your next destination.
      </p>
      <Button onClick={retry} className="mt-6 h-11 px-5">
        Try again
      </Button>
    </div>
  );
}
