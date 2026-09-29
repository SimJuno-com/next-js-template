import type { DestinationPackage } from "@next-js-template/api/types";

// Simjuno prices use 10,000 units per currency unit; volumes are bytes.
export function formatPackagePrice(plan: Pick<DestinationPackage, "price" | "currencyCode">) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currencyCode,
  }).format(plan.price / 10_000);
}

export function formatOrderPrice(order: { price: number; currencyCode: string }) {
  return formatPackagePrice(order);
}

export function formatData(plan: Pick<DestinationPackage, "volume" | "dataType">) {
  if (plan.dataType === 4) return "Unlimited";
  const unit =
    plan.volume >= 1024 ** 3
      ? "GB"
      : plan.volume >= 1024 ** 2
        ? "MB"
        : plan.volume >= 1024
          ? "KB"
          : "B";
  const amount = plan.volume / { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 }[unit];
  const label = `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(amount)} ${unit}`;
  return plan.dataType === 2 || plan.dataType === 3 ? `${label} / day` : label;
}

export function formatDuration(plan: Pick<DestinationPackage, "duration" | "durationUnit">) {
  const unit = plan.durationUnit.toLowerCase().replace(/s$/, "");
  return `${plan.duration} ${unit}${plan.duration === 1 ? "" : "s"}`;
}

export function durationKey(plan: Pick<DestinationPackage, "duration" | "durationUnit">) {
  return `${plan.durationUnit.toUpperCase()}:${plan.duration}`;
}

export function allowanceDescription(dataType: number) {
  if (dataType === 1) return "One data allowance for your whole plan.";
  if (dataType === 2) return "A fresh allowance each day. Speeds reduce after the daily limit.";
  if (dataType === 3) return "A fresh allowance each day. Data pauses after the daily limit.";
  if (dataType === 4) return "Unlimited daily data. Check the fair use policy for speed limits.";
  return "See the plan description for data allowance details.";
}

export function sortPackages(packages: readonly DestinationPackage[]) {
  return [...packages].sort(
    (a, b) =>
      a.currencyCode.localeCompare(b.currencyCode) ||
      a.price - b.price ||
      a.volume - b.volume ||
      a.duration - b.duration ||
      a.packageCode.localeCompare(b.packageCode),
  );
}
