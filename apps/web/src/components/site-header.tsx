"use client";

// Adapted from the licensed React Bits Pro Navigation 7 source.
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { buttonVariants } from "@next-js-template/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@next-js-template/ui/components/dialog";
import { cn } from "@next-js-template/ui/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { SITE_INFO } from "@/constants/site";
import { authClient } from "@/lib/auth-client";

import { LogoMark } from "./logo";

const destinations = [
  {
    title: "All destinations",
    description: "Find country, regional, and global eSIM plans.",
    href: "/destination",
  },
  {
    title: "Japan",
    description: "Stay connected from Tokyo to Kyoto.",
    href: "/destination/japan",
  },
  {
    title: "United States",
    description: "Keep your trip connected, coast to coast.",
    href: "/destination/united-states",
  },
  {
    title: "Thailand",
    description: "Explore the cities, beaches, and beyond.",
    href: "/destination/thailand",
  },
] as const;

const navButton =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-medium tracking-tight shadow-sm backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const planButton = buttonVariants({ className: "h-10 gap-2 px-4 tracking-tight" });

export function SiteHeader() {
  const { data: session } = authClient.useSession();
  const headerAction = session?.user
    ? { href: "/dashboard" as const, label: "Dashboard" }
    : { href: "/destination" as const, label: "Explore plans" };
  const [isDestinationsMenuOpen, setIsDestinationsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.2;

  useEffect(() => {
    if (!isDestinationsMenuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) {
        setIsDestinationsMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [isDestinationsMenuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeMenus = () => {
      setIsMobileMenuOpen(false);
      setMobileExpanded(false);
      setIsDestinationsMenuOpen(false);
    };
    desktop.addEventListener("change", closeMenus);
    return () => desktop.removeEventListener("change", closeMenus);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileExpanded(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full py-4 md:py-6">
      <nav
        aria-label="Main navigation"
        className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3"
      >
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/"
            aria-label={`${SITE_INFO.name} home`}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogoMark />
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setIsDestinationsMenuOpen(true)}
              onMouseLeave={() => {
                if (!dropdownRef.current?.contains(document.activeElement))
                  setIsDestinationsMenuOpen(false);
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setIsDestinationsMenuOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setIsDestinationsMenuOpen(false);
                  dropdownTriggerRef.current?.focus();
                }
              }}
            >
              <button
                ref={dropdownTriggerRef}
                type="button"
                className={navButton}
                aria-expanded={isDestinationsMenuOpen}
                aria-controls="site-destinations"
                onClick={(event) => {
                  // A pointer may have already opened the dropdown on hover.
                  setIsDestinationsMenuOpen((open) => (event.detail === 0 ? !open : true));
                }}
              >
                Destinations
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-3.5 transition-transform motion-reduce:transition-none",
                    isDestinationsMenuOpen && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {isDestinationsMenuOpen && (
                  <motion.div
                    id="site-destinations"
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                    transition={{ duration }}
                    className="absolute top-full left-0 z-50 w-[min(500px,calc(100vw-2rem))] pt-2"
                  >
                    <div className="rounded-2xl border border-border bg-popover py-2 text-popover-foreground shadow-2xl">
                      <p className="my-4 px-4 text-xs font-medium tracking-wider text-muted-foreground">
                        FIND YOUR NEXT CONNECTION
                      </p>
                      <div className="grid grid-cols-2 gap-3 px-2">
                        {destinations.map((item, index) => (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration, delay: reduceMotion ? 0 : index * 0.03 }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setIsDestinationsMenuOpen(false)}
                              className="block h-full rounded-md p-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <span className="mb-1 block text-sm font-medium tracking-tight">
                                {item.title}
                              </span>
                              <span className="block text-xs leading-relaxed text-muted-foreground">
                                {item.description}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href={headerAction.href} className={cn(planButton, "hidden md:inline-flex")}>
            {headerAction.label} <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
          <ThemeToggle className={cn(navButton, "size-10 px-0 ")} />
          <Dialog
            open={isMobileMenuOpen}
            onOpenChange={(open) => {
              setIsMobileMenuOpen(open);
              setMobileExpanded(false);
            }}
          >
            <DialogTrigger aria-label="Open menu" className={cn(navButton, "px-3 md:hidden")}>
              <Menu className="size-4" aria-hidden="true" />
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="inset-0 top-0 left-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-background p-0 text-foreground ring-0 motion-reduce:animate-none sm:max-w-none"
            >
              <DialogTitle className="sr-only">Main navigation</DialogTitle>
              <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">
                <Link
                  href="/"
                  aria-label={`${SITE_INFO.name} home`}
                  onClick={closeMobileMenu}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LogoMark />
                </Link>
                <DialogClose aria-label="Close menu" className={cn(navButton, "px-3")}>
                  <X className="size-4" aria-hidden="true" />
                </DialogClose>
              </div>
              <nav
                aria-label="Mobile navigation"
                className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 sm:p-6"
              >
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className={cn(navButton, "h-auto w-full justify-start py-3")}
                >
                  Home
                </Link>
                <button
                  type="button"
                  aria-expanded={mobileExpanded}
                  aria-controls="mobile-destinations"
                  onClick={() => setMobileExpanded((open) => !open)}
                  className={cn(navButton, "h-auto w-full justify-between py-3")}
                >
                  Destinations
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-5 transition-transform motion-reduce:transition-none",
                      mobileExpanded && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {mobileExpanded && (
                    <motion.div
                      id="mobile-destinations"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 pt-2 pb-1">
                        {destinations.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className="block rounded-md p-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span className="mb-1 block text-sm font-medium">{item.title}</span>
                            <span className="block text-xs leading-relaxed text-muted-foreground">
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </nav>
              <div className="shrink-0 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
                <Link
                  href={headerAction.href}
                  onClick={closeMobileMenu}
                  className={cn(planButton, "h-12 w-full")}
                >
                  {headerAction.label} <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </header>
  );
}
