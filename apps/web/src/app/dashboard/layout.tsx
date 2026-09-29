"use client";

import { useIsMobile } from "@next-js-template/ui/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, House, ReceiptText, CardSim, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWebHaptics } from "web-haptics/react";
import {
  AppSidebar,
  AppSidebarContent,
  AppSidebarGroup,
  AppSidebarGroupContent,
  AppSidebarGroupLabel,
  AppSidebarHeader,
  AppSidebarInset,
  AppSidebarMenu,
  AppSidebarMenuButton,
  AppSidebarMenuItem,
  AppSidebarProvider,
  AppSidebarTrigger,
} from "@/components/app-sidebar";
import { LogoMark } from "@/components/logo";
import { SITE_INFO } from "@/constants/site";
import { useSound } from "@/hooks/soundcn/use-sound";
import { click003Sound } from "@/lib/soundcn/click-003";
import { SidebarUserFooter } from "@/components/sidebar-user-footer";
import { DestinationSearchCommand } from "@/app/(root)/(landing)/_components/destination-search-command";
import { orpc } from "@/lib/orpc";

const ITEMS = [
  { title: "Dashboard", icon: House, href: "/dashboard" },
  { title: "eSIMs", icon: CardSim, href: "/dashboard/esim" },
  { title: "Orders", icon: ReceiptText, href: "/dashboard/orders" },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>();
  const { data: destinations } = useQuery(orpc.catalog.listDestinations.queryOptions());
  const [playClick] = useSound(click003Sound, { volume: 0.1 });
  const { trigger: haptic } = useWebHaptics();

  return (
    <AppSidebarProvider
      open={sidebarOpen ?? !isMobile}
      onOpenChange={setSidebarOpen}
      className="min-h-dvh overflow-x-clip bg-muted/30 p-2 [--app-sidebar-height:calc(100dvh-1rem)] [--app-sidebar-top:0.5rem]"
    >
      <a
        href="#dashboard-content"
        className="sr-only z-50 rounded-lg bg-background p-3 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div className="fixed top-(--app-sidebar-top) z-20 shrink-0 md:sticky">
        <AppSidebarTrigger className="absolute top-3 left-1 z-10 size-9 bg-sidebar data-[sidebar-open=true]:left-[calc(var(--app-sidebar-width)-2.75rem)]" />
        <AppSidebar panelClassName="border border-sidebar-border/80">
          <Link
            href="/"
            className="block shrink-0 rounded-t-(--app-sidebar-radius) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sidebar-ring"
            aria-label={`${SITE_INFO.name} home`}
          >
            <AppSidebarHeader className="h-17 flex-row items-center gap-2.5 pr-12">
              <LogoMark alt="" />
              <div className="min-w-0">
                <p className="truncate text-sm leading-5 font-medium">{SITE_INFO.name}</p>
                <p className="truncate text-xs leading-5 text-muted-foreground">
                  Your travel space
                </p>
              </div>
            </AppSidebarHeader>
          </Link>
          <AppSidebarContent>
            <div className="px-4 pt-4">
              <DestinationSearchCommand
                destinations={destinations ?? { Country: [], Region: [], Global: [] }}
                renderTrigger={(props) => (
                  <AppSidebarMenuButton
                    {...props}
                    aria-label="Find a destination"
                    disabled={!destinations}
                    className="border-sidebar-border/40 bg-sidebar-accent/70 hover:bg-sidebar-accent"
                  >
                    <Search aria-hidden="true" className="size-4" strokeWidth={1.5} />
                    <span>Find a destination</span>
                    <ArrowUpRight aria-hidden="true" className="ml-auto size-3.5 opacity-60" />
                  </AppSidebarMenuButton>
                )}
              />
            </div>
            <AppSidebarGroup>
              <AppSidebarGroupLabel>Workspace</AppSidebarGroupLabel>
              <AppSidebarGroupContent>
                <nav aria-label="Dashboard navigation">
                  <AppSidebarMenu>
                    {ITEMS.map(({ title, icon: Icon, href }) => {
                      const active =
                        pathname === href ||
                        (href === "/dashboard/orders" && pathname === "/dashboard/order") ||
                        (href !== "/dashboard" && pathname.startsWith(`${href}/`));
                      return (
                        <AppSidebarMenuItem key={title}>
                          <AppSidebarMenuButton
                            render={<Link href={href} />}
                            nativeButton={false}
                            role="link"
                            isActive={active}
                            aria-current={active ? "page" : undefined}
                            onClick={() => {
                              if (isMobile) setSidebarOpen(false);
                              playClick();
                              void haptic("selection");
                            }}
                          >
                            <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
                            <span>{title}</span>
                          </AppSidebarMenuButton>
                        </AppSidebarMenuItem>
                      );
                    })}
                  </AppSidebarMenu>
                </nav>
              </AppSidebarGroupContent>
            </AppSidebarGroup>
          </AppSidebarContent>
          <SidebarUserFooter />
        </AppSidebar>
      </div>
      <AppSidebarInset className="min-h-[calc(100dvh-1rem)]">
        <div
          id="dashboard-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-5xl px-4 pt-16 pb-12 outline-none sm:px-6 sm:pb-16 md:pt-10 lg:px-8 lg:pb-20"
        >
          {children}
        </div>
      </AppSidebarInset>
    </AppSidebarProvider>
  );
}
