"use client";

import type {
  DestinationPackage,
  SimjunoDestination,
  SimjunoDestinationGroups,
} from "@next-js-template/api/types";
import { createContext, use } from "react";

export type DestinationPlansData = {
  destination: SimjunoDestination;
  packages: DestinationPackage[];
} | null;

export const DestinationsContext = createContext<Promise<SimjunoDestinationGroups> | null>(null);
export const DestinationPlansContext = createContext<Promise<DestinationPlansData> | null>(null);

export function useDestinations() {
  const promise = use(DestinationsContext);
  if (!promise) throw new Error("Missing DestinationsProvider");
  return use(promise);
}

export function useDestinationPlans() {
  const promise = use(DestinationPlansContext);
  if (!promise) throw new Error("Missing DestinationPlansProvider");
  return use(promise);
}
