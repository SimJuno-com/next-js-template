"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { MoonIcon, SunMediumIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { useSound } from "@/hooks/soundcn/use-sound";
import { switchOffSound } from "@/lib/soundcn/switch-off";
import { switchOnSound } from "@/lib/soundcn/switch-on";

import { Button } from "@next-js-template/ui/components/button";
import { cn } from "@next-js-template/ui/lib/utils";

const subscribeToHydration = () => () => {};

export function ThemeToggle({
  className,
  variant = "icon",
}: {
  className?: string;
  variant?: "icon" | "sidebar";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const [playSwitchOff] = useSound(switchOffSound, { volume: 0.1 });
  const [playSwitchOn] = useSound(switchOnSound, { volume: 0.1 });

  const switchTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    if (nextTheme === "light") playSwitchOn();
    else playSwitchOff();
    setTheme(nextTheme);
  };

  useHotkey("D", switchTheme);

  if (variant === "sidebar") {
    return (
      <label
        title="Toggle dark mode (D)"
        className={cn(
          "flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 text-sm font-normal text-muted-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring/50 has-disabled:cursor-default has-disabled:opacity-50",
          className,
        )}
      >
        <input
          type="checkbox"
          role="switch"
          aria-label="Dark mode"
          aria-keyshortcuts="D"
          checked={mounted && resolvedTheme === "dark"}
          disabled={!mounted}
          onChange={switchTheme}
          className="sr-only"
        />
        <SunMediumIcon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />
        <span className="select-none">Appearance</span>
        <span
          aria-hidden="true"
          className="ml-auto inline-flex h-4 w-7 shrink-0 items-center rounded-full bg-sidebar-border p-0.5 transition-colors motion-reduce:transition-none dark:bg-primary"
        >
          <span className="size-3 rounded-full bg-white shadow-xs transition-transform motion-reduce:transition-none dark:translate-x-3" />
        </span>
      </label>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn("text-foreground", className)}
      onClick={switchTheme}
      aria-label="Toggle theme"
      title="Toggle theme (D)"
    >
      <SunMediumIcon className="dark:hidden" aria-hidden="true" />
      <MoonIcon className="hidden dark:block" aria-hidden="true" />
    </Button>
  );
}
