import { z } from "zod";
import { orderStatus } from "@next-js-template/db/schema/order";

import { listInput, paginationOutput, slug } from "../types/base";
import { base } from "./base";

export const orderSummary = z.object({
  order_id: z.string(),
  esim_id: z.string().nullable(),
  packageSlug: slug,
  packageName: z.string(),
  price: z.number().int().nonnegative(),
  currencyCode: z.string(),
  status: z.enum(orderStatus.enumValues),
});

export const createOrder = base
  .route({
    method: "POST",
    path: "/order",
    tags: ["order"],
    summary: "Create an order",
    successStatus: 201,
  })
  .input(z.object({ packageSlug: slug }))
  .output(z.object({ order_id: z.string() }));

export const orderListInput = listInput.extend({
  s: listInput.shape.s.describe("Search by order ID or package name (case-insensitive)."),
  status: listInput.shape.status
    .pipe(z.enum(["", "awaiting payment", "payment received", "processing", "completed"]))
    .describe("Filter by status; empty means all statuses."),
});

export const listOrder = base
  .route({
    method: "GET",
    path: "/order",
    tags: ["order"],
    summary: "List your orders",
    description:
      "Search and filter your orders, newest first. Pagination totals reflect the active filters.",
  })
  .input(orderListInput.prefault({}))
  .output(
    z.object({
      orders: z.array(orderSummary.extend({ createdAt: z.iso.datetime() })),
      pagination: paginationOutput,
    }),
  );

export const orderStats = base
  .route({
    method: "GET",
    path: "/order/summary",
    tags: ["order"],
    summary: "Get your order totals",
  })
  .output(
    z.object({
      totalOrders: z.number().int().nonnegative(),
      awaitingPayment: z.number().int().nonnegative(),
      esims: z.number().int().nonnegative(),
    }),
  );

export const getOrder = base
  .route({ method: "GET", path: "/order/{id}", tags: ["order"], summary: "Get your order" })
  .input(z.object({ id: z.string().min(1).max(200) }))
  .output(orderSummary);

export const paymentIntent = base
  .route({
    method: "POST",
    path: "/order/{id}/payment-intent",
    tags: ["order"],
    summary: "Create or reuse an order payment intent",
  })
  .input(z.object({ id: z.string().min(1).max(200) }))
  .output(
    z.object({
      status: z.string(),
      clientSecret: z.string().nullable(),
    }),
  );
