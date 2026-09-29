import {
  getPackageInput,
  getPackageOutput,
  listDestinationsOutput,
  listPackagesInput,
  listPackagesOutput,
} from "../types/catalog";
import { base } from "./base";

export const listDestinations = base
  .route({
    method: "GET",
    path: "/catalog/destinations",
    tags: ["catalog"],
    summary: "List all available destinations",
    successStatus: 200,
  })
  .output(listDestinationsOutput);

export const listPackages = base
  .route({
    method: "GET",
    path: "/catalog/packages",
    tags: ["catalog"],
    summary: "List packages for a destination",
    successStatus: 200,
  })
  .input(listPackagesInput)
  .output(listPackagesOutput);

export const getPackage = base
  .route({
    method: "GET",
    path: "/catalog/packages/{slug}",
    tags: ["catalog"],
    summary: "Get a package by slug",
    successStatus: 200,
  })
  .input(getPackageInput)
  .output(getPackageOutput);
