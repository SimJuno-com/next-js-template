import { z } from "zod";

import { listInput, paginationOutput } from "../types/base";
import { base } from "./base";

export const esimSummary = z.object({
  id: z.string(),
  order_id: z.string(),
  packageSlug: z.string(),
  packageName: z.string(),
  status: z.string().nullable(),
  dataUsage: z.number().nonnegative(),
  totalData: z.number().nonnegative(),
  expiresAt: z.string().nullable(),
});

export const esimListInput = listInput.extend({
  s: listInput.shape.s.describe("Search by eSIM ID, order ID, or package name (case-insensitive)."),
});

export const listEsim = base
  .route({
    method: "GET",
    path: "/esim",
    tags: ["esim"],
    summary: "List your eSIMs",
    description:
      "Search and filter your eSIMs, newest first. Pagination totals reflect the active filters.",
  })
  .input(esimListInput.prefault({}))
  .output(z.object({ esims: z.array(esimSummary), pagination: paginationOutput }));

export const getEsim = base
  .route({
    method: "GET",
    path: "/esim/{id}",
    tags: ["esim"],
    summary: "Get your eSIM and installation details",
  })
  .input(z.object({ id: z.string().min(1).max(200) }))
  .output(
    esimSummary.extend({
      qrCodeUrl: z.httpUrl().nullable(),
      shortUrl: z.httpUrl().nullable(),
      activationCode: z.string().nullable(),
    }),
  );
