import { env } from "@next-js-template/env/server";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export { generateId } from "./id";

export function createDb() {
  return drizzle(env.DATABASE_URL, { schema });
}

export const db = createDb();
