import { connection } from "next/server";

import { client } from "@/lib/orpc";
import { Hero } from "./_components/hero";
import { PopularDestinations } from "./_components/popular-destinations";
import { Faq } from "./_components/faq";
import { Features } from "./_components/features";

export default async function Home() {
  // Fetch the current catalog at request time, without requiring API access during builds.
  await connection();
  const destinations = await client.catalog.listDestinations();
  const popularDestinations = {
    Country: destinations.Country.slice(0, 9),
    Region: destinations.Region.slice(0, 9),
    Global: destinations.Global.slice(0, 9),
  };

  return (
    <div className="mx-auto">
      <Hero destinations={destinations} />
      <Features />
      <PopularDestinations destinations={popularDestinations} />
      <Faq />
    </div>
  );
}
