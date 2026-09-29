import { cn } from "@next-js-template/ui/lib/utils";

import { LogosCarousel } from "./logos-carousel";

const TRAVEL_LOGOS = [
  {
    name: "Booking.com",
    file: "booking",
    className: "w-[142px] mask-[url('https://cdn.simjuno.com/template/logo/travel/booking.svg')]",
  },
  {
    name: "Airbnb",
    file: "airbnb",
    className: "w-[116px] mask-[url('https://cdn.simjuno.com/template/logo/travel/airbnb.svg')]",
  },
  {
    name: "Skyscanner",
    file: "skyscanner",
    className:
      "w-[158px] mask-[url('https://cdn.simjuno.com/template/logo/travel/skyscanner.svg')]",
  },
  {
    name: "Tripadvisor",
    file: "tripadvisor",
    className:
      "w-[148px] mask-[url('https://cdn.simjuno.com/template/logo/travel/tripadvisor.svg')]",
  },
] as const;

export function TrustedLogos() {
  return (
    <section
      aria-labelledby="trusted-logos-heading"
      className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8"
    >
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-2xl border border-border bg-background/30 px-5 py-6 backdrop-blur-xl sm:p-8",
          "shadow-surface",
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgb(255_255_255/80%),transparent)] before:content-['']",
          "after:pointer-events-none after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-[linear-gradient(180deg,rgb(255_255_255/80%),transparent,rgb(255_255_255/30%))] after:content-['']",
          "dark:bg-background/40",
          "dark:before:bg-[linear-gradient(90deg,transparent,rgb(255_255_255/15%),transparent)]",
          "dark:after:bg-[linear-gradient(180deg,rgb(255_255_255/15%),transparent,rgb(255_255_255/5%))]",
        )}
      >
        <h2
          id="trusted-logos-heading"
          className="text-center text-xs leading-6 font-medium tracking-wider text-muted-foreground uppercase"
        >
          Trusted by travelers everywhere
        </h2>

        <ul className="sr-only">
          {TRAVEL_LOGOS.map((logo) => (
            <li key={logo.file}>{logo.name}</li>
          ))}
        </ul>

        <div aria-hidden="true">
          <LogosCarousel
            columnCount={TRAVEL_LOGOS.length}
            className="mt-4 h-16 gap-x-4 [--column-count:2] sm:gap-x-6 sm:[--column-count:3] lg:[--column-count:initial] max-sm:[&>:nth-child(n+3)]:hidden sm:max-lg:[&>:nth-child(n+4)]:hidden"
          >
            {TRAVEL_LOGOS.map((logo) => (
              <span
                key={logo.file}
                className={cn(
                  "block h-8 max-w-full shrink-0 bg-muted-foreground/70 mask-contain mask-center mask-no-repeat sm:h-9",
                  logo.className,
                )}
              />
            ))}
          </LogosCarousel>
        </div>
      </div>
    </section>
  );
}
