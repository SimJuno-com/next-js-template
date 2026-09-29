import { simjuno } from "../lib/simjuno";
import { publicRoute } from "./base";

// Returns all destinations currently available from SimJuno.
export const listDestinations = publicRoute.catalog.listDestinations.handler(() =>
  simjuno.esim.listDestinations(),
);

// Returns the SimJuno packages matching the requested filters.
export const listPackages = publicRoute.catalog.listPackages.handler(({ input }) =>
  simjuno.esim.listPackages(input),
);

// Returns one SimJuno package by its slug.
export const getPackage = publicRoute.catalog.getPackage.handler(({ input }) =>
  simjuno.esim.getPackage(input),
);
