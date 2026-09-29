import type { Route } from "next";

export type AuthSearchParams = Promise<{
  email?: string | string[];
  redirect_to?: string | string[];
  next?: string | string[];
  error?: string | string[];
}>;

export function getAuthCallbackURL(redirectTo: unknown): Route {
  if (typeof redirectTo !== "string" || !redirectTo) return "/dashboard";

  const path = redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`;
  const legacyOrder = /^\/dashboard\/order\?id=([^/?#]+)$/.exec(path);
  if (legacyOrder) return `/order/${legacyOrder[1]}` as Route;
  const checkout = /^\/order\/([^/?#]+)$/.exec(path);
  // Keep return URLs on supported app routes, including the selected destination package.
  return (
    path === "/" ||
    path === "/destination" ||
    path === "/dashboard" ||
    path === "/dashboard/order" ||
    path === "/dashboard/orders" ||
    path === "/dashboard/esim" ||
    /^\/dashboard\/esim\/[a-zA-Z0-9_-]+$/.test(path) ||
    checkout ||
    /^\/destination\/[a-zA-Z0-9_.-]+(?:\?package=[a-zA-Z0-9_.-]+)?$/.test(path)
      ? path
      : "/dashboard"
  ) as Route;
}
