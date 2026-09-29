"use client";

import { useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { KeyRound, Link2, LockKeyhole, Trash2, UserRound } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@next-js-template/ui/components/breadcrumb";
import { Button } from "@next-js-template/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@next-js-template/ui/components/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@next-js-template/ui/components/sidebar";
import { Skeleton } from "@next-js-template/ui/components/skeleton";

import { SettingsNameForm, SettingsSecurity } from "./settings-account-forms";

const sections = [
  {
    id: "account",
    label: "Profile",
    icon: UserRound,
    description: "Manage the details associated with your account.",
  },
  {
    id: "password",
    label: "Password",
    icon: KeyRound,
    description: "Keep your account secure with a strong, unique password.",
  },
  {
    id: "connections",
    label: "Linked accounts",
    icon: Link2,
    description: "Manage the accounts you use to sign in.",
  },
  {
    id: "delete",
    label: "Delete account",
    icon: Trash2,
    description: "Permanently close your account. This cannot be undone.",
  },
] as const;

export type SettingsSection = (typeof sections)[number]["id"];
export type SettingsUser = {
  id: string;
  name: string;
  email: string;
  isAnonymous?: boolean | null;
};

export function SettingsAccount({
  user,
  section,
}: {
  user: SettingsUser;
  section: SettingsSection;
}) {
  return (
    <>
      <div hidden={section !== "account"} className="rounded-2xl border bg-card shadow-xs">
        <div className="p-5 sm:p-6">
          {user.isAnonymous ? (
            <p className="text-sm font-medium">Guest account</p>
          ) : (
            <SettingsNameForm key={user.id} name={user.name} />
          )}
        </div>
        <div className="space-y-2 rounded-b-2xl border-t bg-muted/20 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Email address</p>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <LockKeyhole aria-hidden="true" className="size-3" /> Read only
            </span>
          </div>
          <p className="break-words text-sm">
            {user.isAnonymous ? "Email not linked" : user.email}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {user.isAnonymous
              ? "Link your email in the sidebar to save your guest account and access your orders on any device."
              : "The email address you use to sign in."}
          </p>
        </div>
      </div>
      {!user.isAnonymous && <SettingsSecurity key={user.id} user={user} section={section} />}
    </>
  );
}

export function SettingsDialog({
  open,
  onOpenChange,
  user,
  isLoading = false,
  error = false,
  onRetry,
  finalFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: SettingsUser | null;
  isLoading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  finalFocus?: ComponentProps<typeof DialogContent>["finalFocus"];
}) {
  const [selected, setSelected] = useState<SettingsSection>("account");
  const contentRef = useRef<HTMLDivElement>(null);
  const section = sections.find(({ id }) => id === (user?.isAnonymous ? "account" : selected))!;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) setSelected("account");
      }}
    >
      <DialogContent
        finalFocus={finalFocus}
        className="max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden rounded-2xl bg-background p-0 sm:max-w-[700px] lg:max-w-[840px] [&>[data-slot=dialog-close]]:top-4 [&>[data-slot=dialog-close]]:right-4"
      >
        <header className="flex h-16 shrink-0 items-center border-b px-5 pr-14 sm:px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <DialogTitle className="text-sm font-medium">Settings</DialogTitle>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-muted-foreground">{section.label}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <DialogDescription className="sr-only">
          Manage your profile, sign-in methods, and account.
        </DialogDescription>
        <SidebarProvider
          keyboardShortcut={false}
          className="h-[min(580px,calc(100dvh-6rem))] min-h-0 flex-col items-stretch md:flex-row"
          style={{ "--sidebar-width": "12.5rem" } as React.CSSProperties}
        >
          <Sidebar
            collapsible="none"
            className="h-auto w-full shrink-0 border-b bg-muted/30 md:h-full md:w-(--sidebar-width) md:border-r md:border-b-0"
          >
            <SidebarContent>
              <SidebarGroup className="p-3 md:p-4 md:pt-6">
                <p className="mb-3 hidden px-2 text-xs font-medium text-muted-foreground md:block">
                  Account
                </p>
                <SidebarGroupContent>
                  <nav aria-label="Account sections">
                    <SidebarMenuSub className="m-0 grid translate-x-0 grid-cols-2 gap-1 border-0 p-0 md:flex md:flex-col">
                      {sections
                        .filter(({ id }) => id === "account" || (user && !user.isAnonymous))
                        .map(({ id, label, icon: ItemIcon }) => (
                          <SidebarMenuSubItem key={id}>
                            <SidebarMenuSubButton
                              render={
                                <button type="button" disabled={isLoading || error || !user} />
                              }
                              isActive={section.id === id}
                              aria-current={section.id === id ? "page" : undefined}
                              aria-controls="settings-content"
                              onClick={() => {
                                setSelected(id);
                                contentRef.current?.scrollTo({ top: 0 });
                              }}
                              className="h-10 w-full translate-x-0 gap-2.5 rounded-lg px-3 text-left text-[13px] transition-colors data-active:bg-primary/10 data-active:font-medium data-active:text-foreground [&>svg]:text-current"
                            >
                              <ItemIcon aria-hidden="true" strokeWidth={1.75} />
                              <span>{label}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  </nav>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div
            ref={contentRef}
            id="settings-content"
            className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6"
          >
            {isLoading ? (
              <div role="status" aria-label="Loading account" className="space-y-5">
                <Skeleton className="size-10 rounded-xl" />
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-48 rounded-2xl" />
              </div>
            ) : error ? (
              <div className="space-y-4 rounded-2xl border p-5">
                <p role="alert" className="text-sm text-destructive">
                  Unable to load your account.
                </p>
                <Button variant="outline" onClick={onRetry}>
                  Try again
                </Button>
              </div>
            ) : user ? (
              <>
                <div className="mb-6">
                  <h2
                    id={`settings-${section.id}-heading`}
                    className="text-xl font-medium tracking-tight"
                  >
                    {section.label}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <SettingsAccount user={user} section={section.id} />
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sign in to view your account settings.
                </p>
                <Link
                  href="/login?redirect_to=%2Fdashboard"
                  className="text-sm font-medium text-primary underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
