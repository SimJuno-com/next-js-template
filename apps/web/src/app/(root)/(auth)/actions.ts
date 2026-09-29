"use server";

import { env } from "@next-js-template/env/server";

export async function isGoogleSignInEnabled() {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}
