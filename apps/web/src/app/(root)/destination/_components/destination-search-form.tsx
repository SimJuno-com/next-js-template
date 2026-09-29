"use client";

import { Button } from "@next-js-template/ui/components/button";
import { cn } from "cn";
import { Search } from "lucide-react";

type DestinationSearchFormProps = {
  className?: string;
  placeholder?: string;
  buttonLabel?: string;
  value?: string;
  readOnly?: boolean;
  resultsId?: string;
  onValueChange?: (value: string) => void;
  onInputClick?: () => void;
  onSearch: () => void;
};

export function DestinationSearchForm({
  className,
  placeholder = "Where are you traveling?",
  buttonLabel = "Find a plan",
  value,
  readOnly = false,
  resultsId,
  onValueChange,
  onInputClick,
  onSearch,
}: DestinationSearchFormProps) {
  return (
    <form
      className={cn("w-full max-w-xl", className)}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <div
        className={cn(
          "flex min-h-16 w-full flex-col gap-2 rounded-2xl border border-border bg-background/95 p-2 ring-4 ring-background/35 dark:ring-white/10",
          "sm:flex-row sm:items-center sm:pl-4",
          "focus-within:outline-2 focus-within:outline-offset-8 focus-within:outline-primary",
          "shadow-[inset_0_2px_4px_rgb(0_0_0/0.06),0_12px_36px_rgb(15_23_42/0.14)] dark:shadow-[inset_0_2px_4px_rgb(255_255_255/0.03),0_12px_36px_rgb(0_0_0/0.35)]",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2 sm:px-0 sm:py-0">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />

          <input
            type="search"
            aria-label="Search destinations"
            placeholder={placeholder}
            readOnly={readOnly}
            value={value}
            onChange={(event) => onValueChange?.(event.target.value)}
            onClick={onInputClick}
            aria-controls={resultsId}
            autoComplete="off"
            className={cn(
              "w-full min-w-0 appearance-none bg-transparent",
              "text-base font-medium text-foreground",
              "placeholder:text-muted-foreground",
              "rounded-sm outline-none focus:outline-none focus-visible:outline-none",
              "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
            )}
          />
        </div>

        <Button type="submit" className="h-11 px-5 text-sm">
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
}
