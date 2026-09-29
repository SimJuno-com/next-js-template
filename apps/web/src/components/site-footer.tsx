import Image from "next/image";
import Link from "next/link";

import { footerLinks, SITE_INFO } from "@/constants/site";

import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="w-full overflow-hidden bg-background pt-12 sm:pt-16 lg:pt-20">
      <div className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8 grid gap-8 sm:gap-10 md:grid-cols-[minmax(15rem,1fr)_auto] md:items-start lg:gap-16">
        <div>
          <Link
            href="/"
            aria-label={`${SITE_INFO.name} home`}
            className="inline-flex rounded-sm outline-offset-8 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Logo />
          </Link>
          <p className="mt-3 max-w-64 text-sm leading-6 text-muted-foreground">
            A world of possibilities.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-8 sm:gap-x-12 lg:gap-x-16"
        >
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-sm font-medium tracking-tight text-foreground uppercase">
                {group.title}
              </h2>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex rounded-sm text-sm leading-5 text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto mt-8 max-w-6xl select-none sm:mt-12"
      >
        <Image
          src="https://cdn.simjuno.com/template/images/footer-image.webp"
          alt=""
          width={2172}
          height={724}
          sizes="(max-width: 639px) 820px, (max-width: 1023px) 1200px, 100vw"
          className="block h-auto w-full dark:opacity-80"
        />
      </div>
    </footer>
  );
}
