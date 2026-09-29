import Link from "next/link";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_INFO } from "@/constants/site";

// Order details and history depend on verified, expiring credentials.
// Never prerender or share a cached response between visitors.
export const dynamic = "force-dynamic";

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={`${SITE_INFO.name} home`}
            className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Logo />
          </Link>
          <ThemeToggle className="size-9" />
        </header>
        <main>{children}</main>
        <footer className="mt-8 space-y-4 text-center text-xs text-muted-foreground">
          <nav
            aria-label="Order support"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
          >
            <a href={`mailto:${SITE_INFO.email}`} className="hover:text-foreground hover:underline">
              Contact support
            </a>
            <Link href="/terms" className="hover:text-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground hover:underline">
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
