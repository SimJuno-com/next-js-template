import { Skeleton } from "@next-js-template/ui/components/skeleton";
import { Globe, Plane, Settings, Zap } from "lucide-react";

import { CardFrame } from "@/components/card-frame";
import { Faq } from "./_components/faq";
import { Features } from "./_components/features";
import { Section } from "./_components/section";
import { TrustedLogos } from "./_components/trusted-logos";

export default function Loading() {
  return (
    <div className="mx-auto">
      <div role="status" aria-label="Loading travel destinations">
        <p className="sr-only">Loading destination search…</p>
        <div aria-hidden="true">
          <div className="relative isolate -mt-18 overflow-hidden bg-background pt-18 pb-12 text-foreground sm:pb-16 md:-mt-22 md:pt-22 lg:pb-20">
            <div className="relative isolate mx-auto w-full max-w-[76rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <div className="flex items-center gap-2 rounded-full border border-border bg-background/85 px-4 py-1.5 text-muted-foreground shadow-xs shadow-black/5 dark:shadow-black/20">
                  <Plane size={16} className="fill-primary" strokeWidth="0" />
                  <span className="text-xs font-medium tracking-wide">
                    Travel without roaming stress
                  </span>
                </div>
                <h1 className="mt-6 text-[clamp(2rem,7.7vw,3.75rem)] leading-[1.08] font-normal tracking-[-0.045em] text-foreground md:text-[clamp(2.75rem,5.3vw,5.5rem)]">
                  <span className="block whitespace-nowrap">Stay Connected</span>
                  <span className="mt-1 block text-[1.05em] tracking-[-0.035em] whitespace-nowrap text-primary italic [font-family:Georgia,'Times_New_Roman',serif]">
                    Wherever You Go
                  </span>
                </h1>
                <p className="mt-6 max-w-lg text-base leading-7 text-pretty text-muted-foreground">
                  A new destination. A new adventure. Stay connected along the way with a travel
                  eSIM, wherever the world takes you.
                </p>
                <Skeleton className="mt-8 h-27.5 w-full max-w-xl rounded-2xl shadow-surface sm:mt-10 sm:h-16" />
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Zap size={15} /> Instant delivery
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Settings size={15} /> Easy activation
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe size={15} /> Global coverage
                  </span>
                </div>
              </div>
            </div>
            <TrustedLogos />
          </div>
        </div>
      </div>
      <Features />
      <div role="status" aria-label="Loading popular travel plans">
        <p className="sr-only">Loading popular travel plans…</p>
        <div aria-hidden="true">
          <Section>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-medium tracking-[-0.045em] text-balance text-foreground">
                  Popular destinations
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  Pick your next stop and get connected with a travel eSIM in minutes.
                </p>
              </div>
              <Skeleton className="h-12.5 w-72 max-w-full rounded-xl lg:shrink-0" />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {Array.from({ length: 9 }, (_, index) => (
                <CardFrame className="shadow-surface" key={index}>
                  <Skeleton className="h-36 rounded-none" />
                  <div className="relative -mt-5 rounded-t-xl bg-background p-5 sm:p-6">
                    <Skeleton className="absolute -top-12 right-5 size-20 rounded-xl ring-4 ring-background sm:right-6" />
                    <div className="pr-20">
                      <Skeleton className="h-7 w-full" />
                      <Skeleton className="mt-1 h-4 w-24 max-w-full" />
                    </div>
                    <Skeleton className="mt-6 h-11 w-full rounded-lg" />
                  </div>
                </CardFrame>
              ))}
            </div>
          </Section>
        </div>
      </div>
      <Faq />
    </div>
  );
}
