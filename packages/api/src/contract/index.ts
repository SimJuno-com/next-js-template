import { getPackage, listDestinations, listPackages } from "./catalog";
import { getEsim, listEsim } from "./esim";
import { createOrder, getOrder, listOrder, orderStats, paymentIntent } from "./order";

export * from "./catalog";
export * from "./order";
export * from "./esim";

export const contract = {
  esim: { list: listEsim, get: getEsim },
  order: { create: createOrder, get: getOrder, listOrder, stats: orderStats, paymentIntent },
  catalog: {
    listDestinations,
    listPackages,
    getPackage,
  },
};
