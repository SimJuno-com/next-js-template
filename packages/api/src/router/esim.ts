import { db } from "@next-js-template/db";
import { esim } from "@next-js-template/db/schema/esim";
import { order } from "@next-js-template/db/schema/order";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";

import { refreshEsimDetails } from "../lib/esim-sync";
import { protectedRoute } from "./base";

const summary = {
  id: esim.id,
  order_id: esim.orderId,
  packageSlug: order.packageSlug,
  packageName: order.packageName,
  status: esim.status,
  dataUsage: esim.dataUsage,
  totalData: esim.totalData,
  expiresAt: esim.expiresAt,
};

// Lists the signed-in user's saved eSIMs with search, status filtering, and pagination.
export const listEsim = protectedRoute.esim.list.handler(async ({ input, context }) => {
  const { s, status, limit, offset } = input;
  // Treat LIKE metacharacters as literal search text, not wildcard operators.
  const search = `%${s.replace(/[\\%_]/g, "\\$&")}%`;
  const where = and(
    eq(order.userId, context.userId),
    s
      ? or(ilike(esim.id, search), ilike(esim.orderId, search), ilike(order.packageName, search))
      : undefined,
    status ? eq(sql`lower(${esim.status})`, status) : undefined,
  );
  const [esims, [totals]] = await Promise.all([
    db
      .select(summary)
      .from(esim)
      .innerJoin(order, eq(esim.orderId, order.id))
      .where(where)
      .orderBy(desc(order.createdAt), desc(esim.id))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(esim)
      .innerJoin(order, eq(esim.orderId, order.id))
      .where(where),
  ]);
  const total = totals!.total;
  return {
    esims,
    pagination: { total, limit, offset, hasMore: offset + esims.length < total },
  };
});

// Returns one owned eSIM and refreshes missing installation details.
export const getEsim = protectedRoute.esim.get.handler(async ({ input, context, errors }) => {
  // Reads this eSIM only when it belongs to the signed-in user.
  const findOwned = () =>
    db
      .select({
        ...summary,
        qrCodeUrl: esim.qrCodeUrl,
        shortUrl: esim.shortUrl,
        activationCode: esim.activationCode,
      })
      .from(esim)
      .innerJoin(order, eq(esim.orderId, order.id))
      .where(and(eq(esim.id, input.id), eq(order.userId, context.userId)));

  let [saved] = await findOwned();
  if (!saved) throw errors.NOT_FOUND();
  if (!saved.qrCodeUrl) {
    await refreshEsimDetails(saved.id);
    const [refreshed] = await findOwned();
    if (refreshed) saved = refreshed;
  }
  return saved;
});
