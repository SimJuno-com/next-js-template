"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@next-js-template/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@next-js-template/ui/components/dropdown-menu";

export function PlanFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const selectedLabel = options.find((option) => option.value === value)?.label;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${label}: ${selectedLabel}`}
        render={<Button variant="outline" className="h-11 max-w-full gap-3 px-5" />}
      >
        {selectedLabel}
        <ChevronDown className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 min-w-44 overflow-y-auto">
        <DropdownMenuRadioGroup aria-label={label} value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              closeOnClick
              className="min-h-11 py-2.5 pl-3"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
