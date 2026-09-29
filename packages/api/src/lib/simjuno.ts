import { env } from "@next-js-template/env/server";
import { SimjunoApiClient } from "simjuno";

export const simjuno = new SimjunoApiClient({ apiKey: env.SIMJUNO_API_KEY });
