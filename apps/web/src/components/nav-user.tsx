"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@next-js-template/ui/components/avatar";
import { Button } from "@next-js-template/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@next-js-template/ui/components/dropdown-menu";
import { EllipsisVertical, LoaderCircle, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Ref, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { useAppSidebar } from "@/components/app-sidebar";
import { authClient } from "@/lib/auth-client";

type NavUserData = {
  name: string;
  email: string;
  avatar?: string | null;
  isAnonymous?: boolean | null;
};

function subscribeToViewport(callback: () => void) {
  const query = window.matchMedia("(max-width: 767px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function UserIdentity({ user }: { user: NavUserData }) {
  const name = user.isAnonymous ? "Guest account" : user.name.trim() || user.email;
  const initials = user.isAnonymous
    ? "G"
    : name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

  return (
    <>
      <Avatar className="size-8 rounded-full">
        {user.avatar && <AvatarImage src={user.avatar} alt="" />}
        <AvatarFallback className="rounded-full bg-sidebar-accent text-xs text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 gap-1 text-left text-sm leading-tight">
        <span className="truncate font-medium text-sidebar-foreground">{name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {user.isAnonymous ? "Email not linked" : user.email}
        </span>
      </div>
    </>
  );
}

export function NavUser({
  user,
  triggerRef,
  disabled = false,
  onPendingChange,
  onOpenSettings,
}: {
  user: NavUserData;
  triggerRef?: Ref<HTMLButtonElement>;
  disabled?: boolean;
  onPendingChange?: (pending: boolean) => void;
  onOpenSettings: () => void;
}) {
  const router = useRouter();
  const { open: sidebarOpen } = useAppSidebar();
  const isMobile = useSyncExternalStore(
    subscribeToViewport,
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const signingOut = useRef(false);

  async function signOut() {
    if (signingOut.current || disabled) return;
    signingOut.current = true;
    setIsSigningOut(true);
    onPendingChange?.(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "Unable to log out. Please try again.");
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Unable to connect. Check your connection and try again.");
    } finally {
      signingOut.current = false;
      setIsSigningOut(false);
      onPendingChange?.(false);
    }
  }

  return (
    <DropdownMenu open={sidebarOpen && menuOpen} onOpenChange={setMenuOpen}>
      <div className="mt-2 flex h-14 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm font-normal text-muted-foreground">
        <UserIdentity user={user} />
        <DropdownMenuTrigger
          ref={triggerRef}
          render={
            <Button
              size="icon-sm"
              variant="ghost"
              disabled={disabled || isSigningOut}
              aria-label="Open user menu"
              aria-busy={isSigningOut}
              className="ml-auto data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
            />
          }
        >
          {isSigningOut ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <EllipsisVertical aria-hidden="true" className="size-4" />
          )}
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        className="min-w-56"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <UserIdentity user={user} />
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onOpenSettings}>
            <Settings aria-hidden="true" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={disabled || isSigningOut}
          onClick={() => void signOut()}
        >
          <LogOut aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
