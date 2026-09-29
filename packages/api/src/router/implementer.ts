import { implement } from "@orpc/server";
import { contract } from "../contract";

export type AppContext = {
  headers?: Headers;
  resHeaders?: Headers;
  userId?: string;
};

export const implementer = implement(contract).$context<AppContext>();
