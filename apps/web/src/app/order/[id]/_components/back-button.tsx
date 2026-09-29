"use client";

import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BackButton<T extends string>({
  href,
  label = "Back",
}: {
  href?: Route<T>;
  label?: string;
}) {
  const router = useRouter();
  const className =
    "inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
  const content = (
    <>
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </>
  );

  if (href)
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.replace("/destination");
      }}
      className={className}
    >
      {content}
    </button>
  );
}
