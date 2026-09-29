"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { formatForDisplay, formatHotkey, parseHotkey, useHotkey } from "@tanstack/react-hotkeys";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { useWebHaptics } from "web-haptics/react";
import { Button } from "@next-js-template/ui/components/button";
import { Kbd } from "@next-js-template/ui/components/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@next-js-template/ui/components/tooltip";
import { cn } from "@next-js-template/ui/lib/utils";

import { useSound } from "@/hooks/soundcn/use-sound";
import { maximize008Sound } from "@/lib/soundcn/maximize-008";
import { minimize008Sound } from "@/lib/soundcn/minimize-008";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "Meta+B";

type AppSidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  shortcutKey: string | null;
  instant: boolean;
  panelId: string;
  panelRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const AppSidebarContext = React.createContext<AppSidebarContextProps | null>(null);

function useAppSidebar() {
  const context = React.useContext(AppSidebarContext);
  if (!context) {
    throw new Error("useAppSidebar must be used within a AppSidebarProvider.");
  }
  return context;
}

type AppSidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hotkey combination. Defaults to Cmd+B. Pass false to disable it. */
  shortcutKey?: string | false;
};

// Follows the provider/parts pattern from https://ui.shadcn.com/docs/components/base/sidebar.
// Keep triggers outside the animated panel so they remain reachable when it is inert.
function AppSidebarProvider({
  children,
  className,
  defaultOpen = true,
  onOpenChange,
  open: openProp,
  shortcutKey = SIDEBAR_KEYBOARD_SHORTCUT,
  style,
  ...props
}: AppSidebarProviderProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [instant, setInstant] = React.useState(false);
  const open = openProp ?? internalOpen;
  const panelId = React.useId();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [playOpen] = useSound(maximize008Sound, { volume: 0.1 });
  const [playClose] = useSound(minimize008Sound, { volume: 0.1 });
  const { trigger: haptic } = useWebHaptics();
  const parsedShortcut =
    typeof shortcutKey === "string" && shortcutKey.trim() ? parseHotkey(shortcutKey.trim()) : null;
  const normalizedShortcut = parsedShortcut ? formatHotkey(parsedShortcut) : null;

  const setOpen = React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (value) => {
      const nextOpen = typeof value === "function" ? value(open) : value;
      if (!nextOpen && panelRef.current?.contains(document.activeElement)) {
        triggerRef.current?.focus();
      }
      if (openProp === undefined) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open, openProp],
  );

  const toggleSidebar = React.useCallback(() => {
    if (open) playClose();
    else playOpen();
    void haptic("selection");
    setOpen((value) => !value);
  }, [haptic, open, playClose, playOpen, setOpen]);

  React.useEffect(() => {
    if (!instant) return;
    const frame = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(frame);
  }, [instant]);

  useHotkey(
    parsedShortcut ?? SIDEBAR_KEYBOARD_SHORTCUT,
    (event) => {
      if (event.repeat || event.isComposing) return;
      setInstant(true);
      toggleSidebar();
    },
    { enabled: parsedShortcut !== null, ignoreInputs: true, requireReset: true },
  );

  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo<AppSidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      toggleSidebar,
      shortcutKey: normalizedShortcut,
      instant,
      panelId,
      panelRef,
      triggerRef,
    }),
    [state, open, setOpen, toggleSidebar, normalizedShortcut, instant, panelId],
  );

  return (
    <AppSidebarContext.Provider value={contextValue}>
      <div
        data-slot="app-sidebar-wrapper"
        data-state={state}
        style={{ "--sidebar-width": SIDEBAR_WIDTH, ...style } as React.CSSProperties}
        className={cn(
          "[--app-sidebar-height:100dvh]",
          "[--app-sidebar-radius:var(--radius-2xl)]",
          "[--app-sidebar-top:0px]",
          "[--app-sidebar-width:var(--sidebar-width)]",
          "flex w-full items-start",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AppSidebarContext.Provider>
  );
}

type AppSidebarProps = React.ComponentProps<"div"> & {
  /** Classes applied to the animated panel. */
  panelClassName?: string;
};

function AppSidebar({ children, className, panelClassName, ...props }: AppSidebarProps) {
  const { state, open, instant, panelId, panelRef } = useAppSidebar();

  return (
    <div
      data-open={open}
      data-state={state}
      data-instant={instant || undefined}
      data-slot="app-sidebar"
      data-sidebar="sidebar"
      className={cn(
        "group/sidebar peer sticky top-(--app-sidebar-top) isolate flex shrink-0 flex-col overflow-x-clip",
        "w-10 data-open:w-(--app-sidebar-width)",
        "transition-[width] duration-200 ease-[cubic-bezier(0.24,0.88,0.28,0.92)] data-[instant=true]:transition-none motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <div
        ref={panelRef}
        id={panelId}
        aria-hidden={!open}
        className={cn(
          "flex h-(--app-sidebar-height) w-(--app-sidebar-width) flex-col rounded-(--app-sidebar-radius) bg-sidebar text-sidebar-foreground",
          "-translate-x-full data-open:translate-x-0",
          "transition-[translate] duration-200 ease-[cubic-bezier(0.24,0.88,0.28,0.92)] data-[instant=true]:transition-none motion-reduce:transition-none",
          panelClassName,
        )}
        data-instant={instant || undefined}
        data-open={open}
        data-slot="app-sidebar-panel"
        inert={!open}
      >
        {children}
      </div>
    </div>
  );
}

type AppSidebarTriggerProps = React.ComponentProps<typeof Button> & {
  /** Accessible label and tooltip text. */
  toggleLabel?: string;
};

function AppSidebarTrigger({
  children,
  className,
  onClick,
  toggleLabel = "Toggle sidebar",
  ...props
}: AppSidebarTriggerProps) {
  const { open, toggleSidebar, shortcutKey, instant, panelId, triggerRef } = useAppSidebar();
  const shouldReduceMotion = useReducedMotion();

  return (
    <Tooltip>
      <TooltipTrigger
        ref={triggerRef}
        data-slot="app-sidebar-trigger"
        render={
          <Button
            data-slot="app-sidebar-trigger"
            data-sidebar="trigger"
            data-sidebar-open={open}
            data-instant={instant || undefined}
            aria-controls={panelId}
            aria-expanded={open}
            aria-keyshortcuts={shortcutKey ?? undefined}
            aria-label={toggleLabel}
            className={cn(
              "[--trigger-inset:--spacing(1.5)]",
              "[--trigger-radius:calc(var(--app-sidebar-radius)-var(--trigger-inset)+1px)]",
              "size-7 rounded-(--trigger-radius) border-none",
              "text-muted-foreground aria-expanded:bg-transparent aria-expanded:text-muted-foreground hover:text-sidebar-foreground",
              "transition-[left,transform] duration-200 ease-[cubic-bezier(0.24,0.88,0.28,0.92)] active:scale-[0.97] data-[instant=true]:transition-none motion-reduce:transform-none motion-reduce:transition-none",
              className,
            )}
            onClick={(event) => {
              onClick?.(event);
              if (!event.defaultPrevented) toggleSidebar();
            }}
            size="icon-sm"
            variant="ghost"
            {...props}
          >
            {children ?? (
              <AppSidebarIcon
                aria-hidden="true"
                duration={instant || shouldReduceMotion === true ? 0 : undefined}
                open={open}
              />
            )}
          </Button>
        }
      />
      <TooltipContent className="pr-2 pl-3" side="right">
        <div className="flex items-center gap-3">
          {toggleLabel}
          {shortcutKey ? <Kbd>{formatForDisplay(shortcutKey)}</Kbd> : null}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function AppSidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main data-slot="app-sidebar-inset" className={cn("min-w-0 flex-1", className)} {...props} />
  );
}

function AppSidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-sidebar-header"
      data-sidebar="header"
      className={cn("flex shrink-0 flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function AppSidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-sidebar-footer"
      data-sidebar="footer"
      className={cn("flex shrink-0 flex-col gap-1 p-4", className)}
      {...props}
    />
  );
}

function AppSidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-clip overscroll-contain",
        className,
      )}
      {...props}
    />
  );
}

function AppSidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col px-4 py-3", className)}
      {...props}
    />
  );
}

function AppSidebarGroupLabel({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "flex h-8 shrink-0 items-center rounded-md px-2.5 text-xs font-normal text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          className,
        ),
      },
      props,
    ),
    state: { slot: "app-sidebar-group-label", sidebar: "group-label" },
  });
}

function AppSidebarGroupAction({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="app-sidebar-group-action"
      data-sidebar="group-action"
      variant="ghost"
      size="icon-sm"
      className={cn("absolute top-3 right-3", className)}
      {...props}
    />
  );
}

function AppSidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

function AppSidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="app-sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

function AppSidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="app-sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

type AppSidebarMenuButtonProps = Omit<React.ComponentProps<typeof Button>, "size" | "variant"> & {
  isActive?: boolean;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
};

function AppSidebarMenuButton({
  className,
  isActive = false,
  size = "default",
  variant = "default",
  ...props
}: AppSidebarMenuButtonProps) {
  return (
    <Button
      data-slot="app-sidebar-menu-button"
      data-sidebar="menu-button"
      data-active={isActive}
      data-size={size}
      variant={variant === "outline" ? "outline" : "ghost"}
      className={cn(
        "peer/menu-button w-full justify-start gap-2.5 overflow-hidden rounded-xl px-2.5 text-left font-normal text-muted-foreground",
        "transition-[color,background-color,box-shadow] duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none",
        "data-[active=true]:border-sidebar-border data-[active=true]:bg-card data-[active=true]:text-sidebar-foreground data-[active=true]:shadow-[0_1px_2px_rgb(0_0_0/0.03)]",
        "data-[active=true]:hover:bg-card dark:data-[active=true]:bg-sidebar-accent dark:data-[active=true]:hover:bg-sidebar-accent",
        "[&>span:last-child]:truncate",
        size === "default" && "h-9 text-sm",
        size === "sm" && "h-8 text-xs",
        size === "lg" && "h-12 text-base",
        className,
      )}
      {...props}
    />
  );
}

type AppSidebarIconProps = React.ComponentPropsWithoutRef<"svg"> & {
  open?: boolean;
  duration?: number;
};

function AppSidebarIcon({ duration = 0.2, open = false, ...props }: AppSidebarIconProps) {
  return (
    // Icon designed by @ncdai.
    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect
        height="18"
        rx="4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        width="20"
        x="2"
        y="3"
      />
      <motion.rect
        animate={{ width: open ? 6 : 2 }}
        fill="currentColor"
        height="12"
        initial={false}
        rx="1"
        transition={{ duration, ease: [0.23, 1, 0.32, 1] }}
        x="5"
        y="6"
      />
    </svg>
  );
}

export {
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarGroup,
  AppSidebarGroupAction,
  AppSidebarGroupContent,
  AppSidebarGroupLabel,
  AppSidebarHeader,
  AppSidebarIcon,
  AppSidebarInset,
  AppSidebarMenu,
  AppSidebarMenuButton,
  AppSidebarMenuItem,
  AppSidebarProvider,
  AppSidebarTrigger,
  useAppSidebar,
};
export type {
  AppSidebarProps,
  AppSidebarProviderProps,
  AppSidebarTriggerProps,
  AppSidebarMenuButtonProps,
  AppSidebarIconProps,
};

export default AppSidebar;
