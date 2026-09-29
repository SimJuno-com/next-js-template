import { createDb } from "@next-js-template/db";
import * as schema from "@next-js-template/db/schema/auth";
import { order } from "@next-js-template/db/schema/order";
import { env } from "@next-js-template/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { anonymous } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { checkout } from "./checkout";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: schema,
    }),
    trustedOrigins: [env.BETTER_AUTH_URL],
    advanced: { disableOriginCheck: false },
    emailAndPassword: {
      enabled: true,
    },
    user: {
      deleteUser: {
        enabled: true,
        beforeDelete: async (user) => {
          // Revoke any remaining guest checkout proofs before detaching the orders.
          await db
            .update(order)
            .set({ checkoutTokenHash: null, checkoutExpiresAt: null })
            .where(eq(order.userId, user.id));
        },
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/update-user" || ctx.body?.name === undefined) return;
        const name = z.string().trim().min(1).max(100).safeParse(ctx.body.name);
        if (!name.success) {
          throw new APIError("BAD_REQUEST", {
            message: "Use a name between 1 and 100 characters.",
          });
        }
        return { context: { body: { ...ctx.body, name: name.data } } };
      }),
    },
    socialProviders:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
              prompt: "select_account" as const,
            },
          }
        : {},
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    plugins: [
      anonymous({
        onLinkAccount: async ({ anonymousUser, newUser }) => {
          await db
            .update(order)
            .set({ userId: newUser.user.id, checkoutTokenHash: null, checkoutExpiresAt: null })
            .where(eq(order.userId, anonymousUser.user.id));
        },
      }),
      checkout(db),
      nextCookies(),
    ],
  });
}

export const auth = createAuth();
