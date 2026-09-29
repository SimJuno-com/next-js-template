import type { SimjunoApi } from "simjuno";
import { z } from "zod";
import { slug } from "./base";

export const slugInput = z.object({ slug });

export const packageOutput = z.object({
  packageCode: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  currencyCode: z.string(),
  volume: z.number(),
  smsStatus: z.number(),
  dataType: z.number(),
  unusedValidTime: z.number(),
  duration: z.number(),
  durationUnit: z.string(),
  location: z.string(),
  description: z.string(),
  activeType: z.number(),
  speed: z.string(),
  locationNetworkList: z.array(
    z.object({
      locationName: z.string(),
      locationLogo: z.string(),
      locationCode: z.string().optional(),
      operatorList: z
        .array(z.object({ operatorName: z.string(), networkType: z.string() }))
        .optional(),
    }),
  ),
  ipExport: z.string(),
  supportTopUpType: z.number(),
  fupPolicy: z.string().optional(),
  subLocationList: z.array(z.object({ code: z.string(), name: z.string() })).nullish(),
}) satisfies z.ZodType<SimjunoApi.GetPackageResponse>;

const destinationOutput = z.object({
  name: z.string(),
  slug: z.string(),
  locationLogo: z.string(),
  locationName: z.string(),
  from: z.number(),
});

export const listDestinationsOutput = z.object({
  Country: z.array(destinationOutput),
  Region: z.array(destinationOutput),
  Global: z.array(destinationOutput),
}) satisfies z.ZodType<SimjunoApi.ListDestinationsResponse>;

export const listPackagesInput = slugInput;
export const listPackagesOutput = z.object({
  packages: z.array(packageOutput),
  total: z.number(),
}) satisfies z.ZodType<SimjunoApi.ListPackagesResponse>;

export const getPackageInput = slugInput;
export const getPackageOutput = packageOutput;

export type SlugInput = z.infer<typeof slugInput>;
export type PackageOutput = z.infer<typeof packageOutput>;
export type DestinationPackage = PackageOutput;
export type ListDestinationsOutput = z.infer<typeof listDestinationsOutput>;
export type ListPackagesInput = z.infer<typeof listPackagesInput>;
export type ListPackagesOutput = z.infer<typeof listPackagesOutput>;
export type GetPackageInput = z.infer<typeof getPackageInput>;
export type GetPackageOutput = z.infer<typeof getPackageOutput>;

export type SimjunoDestinationGroupKey = keyof ListDestinationsOutput;
export type SimjunoDestination = z.infer<typeof destinationOutput>;
export type SimjunoDestinationGroups = Readonly<
  Record<SimjunoDestinationGroupKey, readonly SimjunoDestination[]>
>;
