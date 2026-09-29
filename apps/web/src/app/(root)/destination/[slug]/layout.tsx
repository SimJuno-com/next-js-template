import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getSeoMetadata } from "@/lib/seo";

import { getDestination, getDestinationPlans } from "@/lib/catalog";

import { DestinationPlansProvider } from "../_components/destination-providers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);
  return getSeoMetadata({
    canonicalUrlRelative: `/destination/${slug}`,
    title: destination ? `${destination.name} eSIM plans` : "Destination not found",
    description: destination
      ? `Compare ${destination.name} travel eSIM plans by data, validity, price, and network coverage.`
      : "Browse available travel eSIM destinations.",
  });
}

export default function DestinationPlansLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const plans = params.then(({ slug }) => getDestinationPlans(slug));
  return <DestinationPlansProvider plans={plans}>{children}</DestinationPlansProvider>;
}
