import { Button } from "@next-js-template/ui/components/button";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function DashboardHeader({ title, description }: { title: string; description: ReactNode }) {
  return (
    <header className="mb-8 sm:mb-10">
      <h1 className="text-2xl leading-tight font-medium tracking-[-0.045em] break-words sm:text-3xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-pretty text-muted-foreground">
        {description}
      </p>
    </header>
  );
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-muted/30 px-5 py-12 text-center sm:px-6 sm:py-16">
      <div className="mb-6 flex size-12 items-center justify-center rounded-xl border bg-background text-muted-foreground shadow-xs">
        <Icon aria-hidden="true" className="size-6" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-medium tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      <Button
        variant="outline"
        className="mt-6 h-11 gap-2 px-5"
        render={<Link href="/destination" />}
        nativeButton={false}
        role="link"
      >
        Browse plans <ArrowUpRight aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

export const esimStatusLabels = new Map([
  ["IN_USE", "In use"],
  ["GOT_RESOURCE", "Ready to install"],
  ["EXPIRED", "Expired"],
  ["SUSPENDED", "Suspended"],
  ["REVOKED", "Revoked"],
  ["USED_UP", "Data used up"],
]);

export function StatusBadge({ status }: { status: string | null }) {
  const color =
    status === "IN_USE" || status === "Completed"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : status === "Awaiting payment"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : status === "Processing" || status === "GOT_RESOURCE"
          ? "bg-blue-500/10 text-blue-700 dark:text-blue-300"
          : "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${color}`}
    >
      <span className="break-words">
        {status ? (esimStatusLabels.get(status) ?? status.replaceAll("_", " ")) : "Provisioning"}
      </span>
    </span>
  );
}
