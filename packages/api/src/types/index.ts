import type { ContractRouterClient } from "@orpc/contract";
import type { contract } from "../contract";

export * from "./base";
export * from "./catalog";

export type AppRouterClient = ContractRouterClient<typeof contract>;
