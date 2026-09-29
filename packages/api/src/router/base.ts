import { auth } from "@next-js-template/auth";

import { implementer } from "./implementer";

export const publicRoute = implementer;

// Adds the current user to the request when a valid session exists.
export const optionalAuthRoute = implementer.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers ?? new Headers() });
  return next({ context: { userId: session?.user.id } });
});

// Rejects the request unless a signed-in user is available.
export const protectedRoute = optionalAuthRoute.use(({ context, next, errors }) => {
  if (!context.userId) throw errors.UNAUTHORIZED();
  return next({ context: { userId: context.userId } });
});
