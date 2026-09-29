import type { ComponentProps } from "react";

import { cn } from "@next-js-template/ui/lib/utils";

export function Section({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-[76rem] scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20",
        className,
      )}
      {...props}
    />
  );
}
