import "server-only";

import { connection } from "next/server";
import { cache } from "react";

import { client } from "@/lib/orpc";

// Share catalog reads between the layouts and metadata within a request.
export const getDestinations = cache(async () => {
  await connection();
  return client.catalog.listDestinations();
});

export const getDestination = cache(async (slug: string) => {
  const destinations = await getDestinations();
  return Object.values(destinations)
    .flat()
    .find((destination) => destination.slug === slug);
});

export async function getDestinationPlans(slug: string) {
  const destination = await getDestination(slug);
  if (!destination) return null;
  const { packages } = await client.catalog.listPackages({ slug });
  return { destination, packages };
}
