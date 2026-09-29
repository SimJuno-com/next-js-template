"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@next-js-template/ui/lib/utils";
import { PRIVACY_POLICY } from "@/constants/privacy";
import { TERMS_OF_SERVICE } from "@/constants/terms";

const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy", document: PRIVACY_POLICY },
  { href: "/terms", label: "Terms", document: TERMS_OF_SERVICE },
] as const;

export function LegalNavigation() {
  const pathname = usePathname();
  const activePage = LEGAL_PAGES.find((page) => page.href === pathname) ?? LEGAL_PAGES[0];

  return (
    <nav aria-label="Legal" className="md:sticky md:top-26">
      <div className="flex items-center gap-2.5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Legal</p>
      </div>

      <ul className="mt-4 flex gap-2 md:block md:space-y-2">
        {LEGAL_PAGES.map((page) => {
          const isActive = page.href === activePage.href;

          return (
            <li key={page.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
                href={page.href}
              >
                {page.label}
              </Link>

              {isActive ? (
                <ol className="mt-2 ml-3 hidden pb-1 pl-3 md:flex md:flex-col md:gap-0.5">
                  {page.document.clauses.map((clause) => (
                    <li key={clause.id}>
                      <a
                        className="block rounded-sm py-1.5 text-xs leading-snug text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        href={`#${clause.id}`}
                      >
                        {clause.title}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
