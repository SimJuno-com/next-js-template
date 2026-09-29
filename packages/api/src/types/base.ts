import { z } from "zod";

export const slug = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-zA-Z0-9_.-]+$/);

const queryInteger = z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]);

export const listInput = z.object({
  s: z.string().trim().max(200).default(""),
  status: z
    .string()
    .trim()
    .toLowerCase()
    .max(200)
    .default("")
    .describe("Filter by status (case-insensitive); empty means all statuses."),
  limit: queryInteger.pipe(z.number().int().min(1).max(100)).default(10),
  offset: queryInteger.pipe(z.number().int().min(0).max(2_147_483_647)).default(0),
});

export const paginationOutput = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
  hasMore: z.boolean(),
});

export type ListInput = z.infer<typeof listInput>;
export type Pagination = z.infer<typeof paginationOutput>;
