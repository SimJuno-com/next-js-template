import { doublePrecision, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { generateId } from "../id";
import { order } from "./order";

export const esim = pgTable("esim", {
  id: text("id").primaryKey().$defaultFn(generateId),
  // One purchased package produces one eSIM. Ownership follows the order.
  orderId: text("order_id")
    .notNull()
    .unique()
    .references(() => order.id),
  providerEsimId: text("provider_esim_id").notNull().unique(),

  status: text("status"),
  qrCodeUrl: text("qr_code_url"),
  shortUrl: text("short_url"),
  activationCode: text("activation_code"),
  dataUsage: doublePrecision("data_usage").notNull().default(0),
  totalData: doublePrecision("total_data").notNull().default(0),
  expiresAt: text("expires_at"),
  detailsFetchedAt: timestamp("details_fetched_at"),
  statusUpdatedAt: timestamp("status_updated_at"),
  usageUpdatedAt: timestamp("usage_updated_at"),
  validityUpdatedAt: timestamp("validity_updated_at"),
});
