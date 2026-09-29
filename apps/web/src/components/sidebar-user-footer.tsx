"use client";

import { Button } from "@next-js-template/ui/components/button";
import { Skeleton } from "@next-js-template/ui/components/skeleton";
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AppSidebarFooter, AppSidebarMenuButton, useAppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { SettingsDialog } from "@/components/settings-dialog";
import { SidebarOptInForm } from "@/components/sidebar-opt-in-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_INFO } from "@/constants/site";
import { authClient } from "@/lib/auth-client";

export function SidebarUserFooter() {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const userMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const { open: sidebarOpen, triggerRef: sidebarTriggerRef } = useAppSidebar();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("settings") !== "account") return;
    setSettingsOpen(true);
    if (url.searchParams.has("error")) {
      toast.error(
        "Google linking wasn't completed. Try again using the same email as your account.",
      );
    }
    url.searchParams.delete("settings");
    url.searchParams.delete("error");
    url.searchParams.delete("error_description");
    window.history.replaceState(null, "", url);
  }, []);

  return (
    <>
      <AppSidebarFooter className="max-h-[calc(100%-4.25rem)] overflow-y-auto overscroll-contain">
        {!isPending && !error && session?.user?.isAnonymous ? (
          <div className="mb-3">
            <SidebarOptInForm />
          </div>
        ) : null}
        <ThemeToggle variant="sidebar" />
        <AppSidebarMenuButton
          render={<a href={`mailto:${SITE_INFO.email}`} />}
          nativeButton={false}
          role="link"
        >
          <CircleHelp aria-hidden="true" className="size-4" strokeWidth={1.5} />
          <span>Help &amp; support</span>
        </AppSidebarMenuButton>
        {isPending ? (
          <div
            role="status"
            aria-label="Loading account"
            className="mt-2 flex h-14 items-center gap-2.5 px-2.5"
          >
            <Skeleton className="size-8 rounded-full" />
            <div className="grid flex-1 gap-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : error ? (
          <div className="grid gap-2 px-1">
            <p role="alert" className="text-xs text-destructive">
              Unable to load your account.
            </p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : session?.user && !session.user.isAnonymous ? (
          <NavUser
            user={{ ...session.user, avatar: session.user.image }}
            triggerRef={userMenuTriggerRef}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        ) : null}
      </AppSidebarFooter>
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        user={session?.user}
        isLoading={isPending}
        error={Boolean(error)}
        onRetry={() => void refetch()}
        finalFocus={sidebarOpen ? userMenuTriggerRef : sidebarTriggerRef}
      />
    </>
  );
}
