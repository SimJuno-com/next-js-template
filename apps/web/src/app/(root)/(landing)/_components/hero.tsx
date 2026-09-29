"use client";

import { Globe, Plane, Settings, Zap } from "lucide-react";
import Image from "next/image";

import type { SimjunoDestinationGroups } from "@next-js-template/api/types";

import { DestinationSearchCommand } from "./destination-search-command";
import { TrustedLogos } from "./trusted-logos";

export function Hero({ destinations }: { destinations: SimjunoDestinationGroups }) {
  return (
    <div className="relative isolate -mt-18 overflow-hidden bg-background pt-18 pb-12 text-foreground [--hero-overlay:255_255_255] dark:[--hero-overlay:10_14_23] sm:pb-16 md:-mt-22 md:pt-22 lg:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_calc(100%_-_1rem),transparent_calc(100%_-_1px))]"
      >
        {/* Portrait crops need a wider source to keep the landscape cloud detail sharp. */}
        <Image
          src="https://cdn.simjuno.com/template/images/hero-light.webp"
          alt=""
          fill
          fetchPriority="high"
          quality={90}
          sizes="(max-width: 767px) 1400px, 100vw"
          className="object-cover object-center dark:hidden"
        />
        <Image
          src="https://cdn.simjuno.com/template/images/hero-dark.webp"
          alt=""
          fill
          fetchPriority="high"
          quality={90}
          sizes="(max-width: 767px) 1400px, 100vw"
          className="hidden object-cover object-center dark:block"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--hero-overlay)/10%)_0%,rgb(var(--hero-overlay)/85%)_28%,rgb(var(--hero-overlay)/90%)_52%,rgb(var(--hero-overlay)/55%)_76%,rgb(var(--hero-overlay)/10%)_100%)] md:bg-[radial-gradient(ellipse_at_50%_45%,rgb(var(--hero-overlay)/98%)_0%,rgb(var(--hero-overlay)/94%)_24%,rgb(var(--hero-overlay)/55%)_48%,rgb(var(--hero-overlay)/10%)_75%)]" />
        <div className="absolute inset-x-0 -bottom-px h-32 bg-linear-to-b from-background/0 via-background/70 to-background to-90% backdrop-blur-lg [mask-image:linear-gradient(to_bottom,transparent,black_70%)] sm:h-40" />
      </div>

      <section className="relative isolate mx-auto w-full max-w-[76rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative z-1 mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/85 px-4 py-1.5 text-muted-foreground shadow-xs shadow-black/5 backdrop-blur-sm dark:shadow-black/20">
            <Plane size={16} aria-hidden="true" className="fill-primary" strokeWidth="0" />
            <span className="text-xs font-medium tracking-wide">Travel without roaming stress</span>
          </div>

          <h1 className="mt-6 text-[clamp(2rem,7.7vw,3.75rem)] leading-[1.08] font-normal tracking-[-0.045em] text-foreground md:text-[clamp(2.75rem,5.3vw,5.5rem)]">
            <span className="block whitespace-nowrap">Stay Connected</span>
            <span className="mt-1 block text-[1.05em] tracking-[-0.035em] whitespace-nowrap text-primary italic [font-family:Georgia,'Times_New_Roman',serif]">
              Wherever You Go
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-pretty text-muted-foreground">
            A new destination. A new adventure. Stay connected along the way with a travel eSIM,
            wherever the world takes you.
          </p>

          <DestinationSearchCommand className="mt-8 sm:mt-10" destinations={destinations} />

          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground sm:text-sm">
            <span className="flex items-center gap-1.5">
              <Zap size={15} aria-hidden="true" /> Instant delivery
            </span>
            <span className="flex items-center gap-1.5">
              <Settings size={15} aria-hidden="true" /> Easy activation
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={15} aria-hidden="true" /> Global coverage
            </span>
          </p>
        </div>
      </section>
      <TrustedLogos />
    </div>
  );
}
