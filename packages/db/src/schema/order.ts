import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { generateId } from "../id";
import { user } from "./auth";

export const orderStatus = pgEnum("order_status", [
  "Awaiting payment",
  "Payment received",
  "Processing",
  "Completed",
]);

export const order = pgTable(
  "order",
  {
    id: text("id").primaryKey().$defaultFn(generateId),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    packageSlug: text("package_slug").notNull(),
    packageName: text("package_name").notNull(),
    price: integer("price").notNull(),
    currencyCode: text("currency_code").notNull(),
    status: orderStatus("status").notNull().default("Awaiting payment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),

    stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
    paidAt: timestamp("paid_at"),
    checkoutTokenHash: text("checkout_token_hash"),
    checkoutExpiresAt: timestamp("checkout_expires_at"),
  },
  (table) => [index("order_user_id_idx").on(table.userId)],
);
