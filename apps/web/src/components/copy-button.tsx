"use client";

// Adapted from https://chanhdai.com/r/copy-button.json.
import { Button } from "@next-js-template/ui/components/button";
import { cn } from "@next-js-template/ui/lib/utils";
import { CheckIcon, CircleXIcon, CopyIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

import { IconSwap, IconSwapItem } from "@/components/icon-swap";
import type { CopyState } from "@/hooks/use-copy-to-clipboard";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export type CopyStateIconProps = {
  state: CopyState;
  /** Custom icon for idle state. */
  idleIcon?: React.ReactNode;
  /** Custom icon for done state. */
  doneIcon?: React.ReactNode;
  /** Custom icon for error state. */
  errorIcon?: React.ReactNode;
};

export function CopyStateIcon({ state, idleIcon, doneIcon, errorIcon }: CopyStateIconProps) {
  return (
    <IconSwap>
      <IconSwapItem key={state} as={motion.span} className="flex" aria-hidden="true">
        {state === "idle" && (idleIcon ?? <CopyIcon data-slot="idle-icon" />)}
        {state === "done" && (doneIcon ?? <CheckIcon data-slot="done-icon" />)}
        {state === "error" && (errorIcon ?? <CircleXIcon data-slot="error-icon" />)}
      </IconSwapItem>
    </IconSwap>
  );
}

export type CopyButtonProps = ComponentProps<typeof Button> & {
  /** The text to copy, or a function that returns the text. */
  text: string | (() => string);
  /** Called with the copied text on successful copy. */
  onCopySuccess?: (text: string) => void;
  /** Called with the error if the copy operation fails. */
  onCopyError?: (error: Error) => void;
} & Omit<CopyStateIconProps, "state">;

export function CopyButton({
  className,
  size = "icon",
  children,
  text,
  idleIcon,
  doneIcon,
  errorIcon,
  onClick,
  onCopySuccess,
  onCopyError,
  ...props
}: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard({ onCopySuccess, onCopyError });

  return (
    <>
      <Button
        type="button"
        className={cn("will-change-transform", className)}
        size={size}
        aria-label="Copy"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) void copy(text);
        }}
        {...props}
      >
        <CopyStateIcon
          state={state}
          idleIcon={idleIcon}
          doneIcon={doneIcon}
          errorIcon={errorIcon}
        />
        {children}
      </Button>
      <span className="sr-only" role="status">
        {state === "done"
          ? "Copied to clipboard"
          : state === "error"
            ? "Unable to copy. Please try again."
            : ""}
      </span>
    </>
  );
}
