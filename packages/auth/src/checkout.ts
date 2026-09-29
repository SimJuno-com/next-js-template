import type { createDb } from "@next-js-template/db";
import { user } from "@next-js-template/db/schema/auth";
import { order } from "@next-js-template/db/schema/order";
import { APIError, createAuthEndpoint, getAuthoritativeSessionFromCtx } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { checkoutCookie, hasCheckoutAccess } from "./checkout-access";

export function checkout(db: ReturnType<typeof createDb>) {
  return {
    id: "checkout" as const,
    endpoints: {
      claimCheckout: createAuthEndpoint(
        "/checkout/claim",
        {
          method: "POST",
          requireHeaders: true,
          body: z.object({ orderId: z.string().min(1).max(200) }),
        },
        async (ctx) => {
          // This browser request—not the Stripe webhook—establishes the session.
          const current = await getAuthoritativeSessionFromCtx(ctx);
          const result = await db.transaction(async (tx) => {
            const [saved] = await tx
              .select()
              .from(order)
              .where(eq(order.id, ctx.body.orderId))
              .for("update");
            if (!saved) throw new APIError("NOT_FOUND", { message: "Order not found." });
            if (current?.user.id === saved.userId) {
              // Revoke the proof only after a request proves the session cookie arrived.
              // A lost first response can still retry the handoff with its checkout cookie.
              await tx
                .update(order)
                .set({ checkoutTokenHash: null, checkoutExpiresAt: null })
                .where(eq(order.id, saved.id));
              return { ready: true, login: null };
            }
            if (!hasCheckoutAccess(saved, ctx.headers)) {
              throw new APIError("NOT_FOUND", { message: "Order not found." });
            }
            if (current) {
              throw new APIError("CONFLICT", {
                message:
                  "This checkout belongs to a different account. Sign out before recovering it.",
              });
            }
            if (!saved.paidAt || !saved.userId) return { ready: false, login: null };
            const [guest] = await tx.select().from(user).where(eq(user.id, saved.userId));
            // A checkout proof must never sign someone into a registered account.
            if (!guest?.isAnonymous)
              throw new APIError("NOT_FOUND", { message: "Order not found." });
            const session = await ctx.context.internalAdapter.createSession(guest.id);
            if (!session)
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: "Unable to start your session.",
              });
            return { ready: true, login: { session, user: guest } };
          });
          if (result.login) await setSessionCookie(ctx, result.login);
          else if (result.ready)
            ctx.responseHeaders?.append("Set-Cookie", checkoutCookie(ctx.body.orderId));
          ctx.setHeader("Cache-Control", "private, no-store");
          return ctx.json({ ready: result.ready, signedIn: Boolean(result.login) });
        },
      ),
    },
  };
}
