import { getPackage, listDestinations, listPackages } from "./catalog";
import { getEsim, listEsim } from "./esim";
import { implementer } from "./implementer";
import { createOrder, getOrder, listOrder, orderStats } from "./order";
import { paymentIntent } from "./payment";

export const router = implementer.router({
  esim: { list: listEsim, get: getEsim },
  order: { create: createOrder, get: getOrder, listOrder, stats: orderStats, paymentIntent },
  catalog: {
    listDestinations,
    listPackages,
    getPackage,
  },
});
