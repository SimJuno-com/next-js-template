import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { order } from "@next-js-template/db/schema/order";
import { env } from "@next-js-template/env/server";
import { parseCookies } from "better-auth/cookies";

type CheckoutOrder = Pick<
  typeof order.$inferSelect,
  "id" | "userId" | "checkoutTokenHash" | "checkoutExpiresAt"
>;
const lifetime = 7 * 24 * 60 * 60;
const secure = new URL(env.BETTER_AUTH_URL).protocol === "https:";
const cookieName = (id: string) => `${secure ? "__Host-" : ""}checkout_${encodeURIComponent(id)}`;
const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export function checkoutCookie(id: string, token = "", maxAge = 0) {
  return `${cookieName(id)}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export function createCheckoutAccess(id: string) {
  const token = randomBytes(32).toString("base64url");
  return {
    checkoutTokenHash: hash(token),
    checkoutExpiresAt: new Date(Date.now() + lifetime * 1000),
    cookie: checkoutCookie(id, token, lifetime),
  };
}

export function hasCheckoutAccess(saved: CheckoutOrder, headers?: Headers) {
  if (
    !saved.checkoutTokenHash ||
    !saved.checkoutExpiresAt ||
    saved.checkoutExpiresAt <= new Date()
  ) {
    return false;
  }
  const token = parseCookies(headers?.get("cookie") ?? "").get(cookieName(saved.id));
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const expected = Buffer.from(saved.checkoutTokenHash, "hex");
  const actual = Buffer.from(hash(token), "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function canAccessOrder(
  saved: CheckoutOrder,
  context: { userId?: string; headers?: Headers },
) {
  return (
    Boolean(saved.userId && saved.userId === context.userId) ||
    hasCheckoutAccess(saved, context.headers)
  );
}
