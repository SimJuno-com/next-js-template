"use client";

import type { SimjunoDestinationGroups } from "@next-js-template/api/types";
import type { ReactNode } from "react";

import {
  DestinationPlansContext,
  DestinationsContext,
  type DestinationPlansData,
} from "@/hooks/use-destination-data";

export function DestinationsProvider({
  children,
  destinations,
}: {
  children: ReactNode;
  destinations: Promise<SimjunoDestinationGroups>;
}) {
  return <DestinationsContext value={destinations}>{children}</DestinationsContext>;
}

export function DestinationPlansProvider({
  children,
  plans,
}: {
  children: ReactNode;
  plans: Promise<DestinationPlansData>;
}) {
  return <DestinationPlansContext value={plans}>{children}</DestinationPlansContext>;
}
