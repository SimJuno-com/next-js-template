import { canAccessOrder, createCheckoutAccess } from "@next-js-template/auth/checkout-access";
import { db, generateId } from "@next-js-template/db";
import { esim } from "@next-js-template/db/schema/esim";
import { order } from "@next-js-template/db/schema/order";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { SimjunoApiError } from "simjuno";

import { simjuno } from "../lib/simjuno";
import { orderSummary } from "../contract/order";
import { optionalAuthRoute, protectedRoute } from "./base";

// Creates an order from the latest SimJuno package details.
export const createOrder = optionalAuthRoute.order.create.handler(
  async ({ input, context, errors }) => {
    const plan = await simjuno.esim.getPackage({ slug: input.packageSlug }).catch((error) => {
      if (error instanceof SimjunoApiError && error.statusCode === 404) throw errors.NOT_FOUND();
      throw error;
    });
    const snapshot = orderSummary.omit({ order_id: true, esim_id: true, status: true }).parse({
      packageSlug: plan.slug,
      packageName: plan.name,
      price: plan.price,
      currencyCode: plan.currencyCode,
    });
    const id = generateId();
    const access = context.userId ? null : createCheckoutAccess(id);
    if (access && !context.resHeaders) throw new Error("Checkout cookies are unavailable.");
    await db.insert(order).values({
      id,
      ...snapshot,
      userId: context.userId ?? null,
      checkoutTokenHash: access?.checkoutTokenHash,
      checkoutExpiresAt: access?.checkoutExpiresAt,
    });
    if (access) context.resHeaders!.append("Set-Cookie", access.cookie);
    return { order_id: id };
  },
);

// Lists the signed-in user's orders with search and pagination.
export const listOrder = protectedRoute.order.listOrder.handler(async ({ input, context }) => {
  const { s, status, limit, offset } = input;
  // Treat LIKE metacharacters as literal search text, not wildcard operators.
  const search = `%${s.replace(/[\\%_]/g, "\\$&")}%`;
  const where = and(
    eq(order.userId, context.userId),
    s ? or(ilike(order.id, search), ilike(order.packageName, search)) : undefined,
    status ? eq(sql`lower(${order.status}::text)`, status) : undefined,
  );
  const [saved, total] = await Promise.all([
    db
      .select({ order, esimId: esim.id })
      .from(order)
      .leftJoin(esim, eq(esim.orderId, order.id))
      .where(where)
      .orderBy(desc(order.createdAt), desc(order.id))
      .limit(limit)
      .offset(offset),
    db.$count(order, where),
  ]);
  return {
    orders: saved.map((row) => ({
      ...orderSummary.parse({ ...row.order, order_id: row.order.id, esim_id: row.esimId }),
      createdAt: row.order.createdAt.toISOString(),
    })),
    pagination: { total, limit, offset, hasMore: offset + saved.length < total },
  };
});

// Returns order counts for the signed-in user's dashboard.
export const orderStats = protectedRoute.order.stats.handler(async ({ context }) => {
  const [totals] = await db
    .select({
      totalOrders: count(order.id),
      awaitingPayment: sql`count(*) filter (where ${order.status} = 'Awaiting payment')`.mapWith(
        Number,
      ),
      esims: count(esim.id),
    })
    .from(order)
    .leftJoin(esim, eq(esim.orderId, order.id))
    .where(eq(order.userId, context.userId));
  return totals!;
});

// Returns an order when the current user or checkout token can access it.
export const getOrder = optionalAuthRoute.order.get.handler(async ({ input, context, errors }) => {
  const [saved] = await db
    .select({ order, esimId: esim.id })
    .from(order)
    .leftJoin(esim, eq(esim.orderId, order.id))
    .where(eq(order.id, input.id));
  // An ID alone never grants access, even before the webhook creates the guest.
  if (!saved || !canAccessOrder(saved.order, context)) throw errors.NOT_FOUND();
  return orderSummary.parse({ ...saved.order, order_id: saved.order.id, esim_id: saved.esimId });
});
