import { ArrowUpRight, Check, Globe, ShieldCheck, Smartphone, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@next-js-template/ui/components/button";
import { cn } from "@next-js-template/ui/lib/utils";

import { IsometricCubeButton } from "./isometric-button";
import { Section } from "./section";

const features = [
  {
    title: "Global Coverage",
    description:
      "One country or a whole itinerary. Find country, regional, and global plans for your trip.",
    visual: CoveragePreview,
    icon: Globe,
    className: "lg:col-span-5",
    backgroundClassName: "hue-rotate-180",
  },

  {
    title: "Instant Activation",
    description: "Your service works the moment you pay. No waiting, no approvals. Top up anytime.",
    visual: ActivationPreview,
    icon: Zap,
    className: "group/activation lg:col-span-7",
    backgroundClassName: "",
  },
  {
    title: "No Sign-Up Required",
    description: "No account, no email, no ID checks, no KYC. Just secure connectivity.",
    visual: PrivacyPreview,
    icon: ShieldCheck,
    className: "lg:col-span-7",
    backgroundClassName: "-hue-rotate-60",
  },
  {
    title: "No Physical SIM Needed",
    description:
      "A tiny upgrade for a bigger adventure. Install on a compatible, unlocked phone. No SIM swaps needed.",
    visual: EsimPreview,
    icon: Smartphone,
    className: "lg:col-span-5",
    backgroundClassName: "hue-rotate-30",
  },
];

export function Features() {
  return (
    <Section id="features" aria-labelledby="features-heading">
      <header className="grid gap-6 md:grid-cols-2 md:items-center md:gap-12">
        <div>
          <h2
            id="features-heading"
            className="max-w-lg text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-medium tracking-[-0.045em] text-balance text-foreground"
          >
            More freedom. Less hassle.
          </h2>
        </div>
        <div className="md:justify-self-end ">
          <p className="max-w-sm text-base leading-7 text-pretty text-muted-foreground">
            Everything you need to stay connected. Nothing to get in your way. Travel on your terms.
          </p>

          <Link
            href="/destination"
            prefetch={false}
            className={cn(buttonVariants(), "mt-6 h-11 gap-2 px-5")}
          >
            Explore plans
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </header>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-12">
        {features.map(
          ({ title, description, visual: Visual, icon: Icon, className, backgroundClassName }) => (
            <li
              key={title}
              className={cn(
                "group/feature relative isolate flex min-w-0 flex-col overflow-hidden rounded-(--feature-radius) border border-white/30 bg-muted shadow-surface [--feature-radius:var(--radius-2xl)] dark:border-white/10",
                className,
              )}
            >
              <Image
                src="https://cdn.simjuno.com/template/images/i1.webp"
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 60vw"
                className={cn("pointer-events-none -z-10 object-cover", backgroundClassName)}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-background/50 opacity-0 dark:opacity-50"
              />
              <Visual />
              <div className="relative -mt-5 flex-1 rounded-(--feature-radius) border-4 border-white/25 bg-linear-to-br from-white/50 via-white/30 to-white/75 bg-clip-padding p-5 shadow-[inset_0_1px_0_rgb(255_255_255/65%)] backdrop-blur-xl dark:border-white/10 dark:from-background/10 dark:via-background/20 dark:to-background/30 dark:shadow-[inset_0_1px_0_rgb(255_255_255/15%)] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="min-w-0 self-center text-xl leading-7 font-medium tracking-tight text-balance text-foreground">
                    {title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/35 text-foreground shadow-[inset_0_1px_2px_rgb(255_255_255/50%)] dark:border-white/10 dark:bg-white/10 dark:shadow-[inset_0_1px_2px_rgb(255_255_255/10%)]"
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                </div>
                <p className="mt-2 max-w-lg text-sm leading-6 text-pretty text-foreground/75">
                  {description}
                </p>
              </div>
            </li>
          ),
        )}
      </ul>
    </Section>
  );
}

function PrivacyPreview() {
  return (
    <div aria-hidden="true" className="flex h-64 shrink-0 items-center justify-center px-6 sm:h-72">
      <div className="flex w-full max-w-sm -space-y-2 flex-col items-center">
        {["No account needed", "No email required", "No ID verification"].map((label) => (
          <div
            key={label}
            className="flex w-full items-center gap-3 rounded-full border border-white/40 bg-white/35 py-2.5 pr-4 pl-2.5 text-sm font-medium text-foreground shadow-sm shadow-black/5 backdrop-blur-xl odd:rotate-3 even:-rotate-3 dark:shadow-black/20 last:w-4/5 dark:border-white/15 dark:bg-background/20 sm:text-base"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/50 dark:bg-white/15 sm:size-8">
              <Check className="size-3.5" />
            </span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivationPreview() {
  return (
    <div className="relative isolate flex h-64 shrink-0 items-center justify-center px-6 sm:h-72">
      <IsometricCubeButton />
    </div>
  );
}

function CoveragePreview() {
  return (
    <div aria-hidden="true" className="relative h-64 shrink-0 sm:h-72">
      <Image
        src="https://cdn.simjuno.com/template/images/features/global-coverage.webp"
        alt=""
        fill
        sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 480px"
        className="object-contain p-8 drop-shadow-xl"
      />
    </div>
  );
}

function EsimPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-64 shrink-0 items-center justify-center px-6 sm:h-72"
    >
      <div className="relative h-56 w-48 shrink-0 sm:w-56">
        <Image
          src="https://cdn.simjuno.com/template/images/features/digital-esim.webp"
          alt=""
          fill
          sizes="(max-width: 639px) 192px, 224px"
          className="object-contain drop-shadow-xl"
        />
      </div>
    </div>
  );
}
