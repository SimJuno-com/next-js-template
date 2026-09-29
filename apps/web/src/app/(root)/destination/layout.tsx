import type { ReactNode } from "react";

import { getSeoMetadata } from "@/lib/seo";

import { getDestinations } from "@/lib/catalog";

import { DestinationsProvider } from "./_components/destination-providers";

export const metadata = {
  referrer: "no-referrer" as const,
  ...getSeoMetadata({
    canonicalUrlRelative: "/destination",
    title: "Browse destinations",
    description: "Search by country, region, or global plan and choose a travel eSIM data plan.",
  }),
};

export default function DestinationLayout({ children }: { children: ReactNode }) {
  // Pass the promise through; the page suspends inside its loading/error boundaries.
  return <DestinationsProvider destinations={getDestinations()}>{children}</DestinationsProvider>;
}
