import { db } from "@next-js-template/db";
import { esim } from "@next-js-template/db/schema/esim";
import { order } from "@next-js-template/db/schema/order";
import { and, eq, isNull, lte, or } from "drizzle-orm";
import { z } from "zod";

// import { simjuno } from "./simjuno";

export type SimjunoEvent = {
  type: string;
  created_at: string;
  data: Record<string, unknown>;
};

const identity = z.object({
  transactionId: z.string().min(1),
  esimId: z.string().min(1),
});
const statusEvent = identity.extend({ esimStatus: z.string().min(1).optional() });
const usageEvent = identity.extend({
  totalVolume: z.number().nonnegative().optional(),
  orderUsage: z.number().nonnegative().optional(),
});
const validityEvent = identity.extend({
  expiredTime: z.iso.datetime({ offset: true }).optional(),
});
const detailsResponse = z.object({
  id: z.string().min(1),
  esimStatus: z.string().nullable(),
  qrCodeUrl: z.httpUrl().nullable(),
  shortUrl: z.httpUrl().nullable(),
  ac: z.string().nullable(),
  dataUsage: z.number().nonnegative(),
  totalData: z.number().nonnegative(),
  expired_time: z.string().nullable(),
});

// Fetches an eSIM from SimJuno and saves its latest details.
async function fetchAndSaveDetails(id: string, retryMissingQr: boolean) {
  await db.transaction(async (tx) => {
    const [saved] = await tx.select().from(esim).where(eq(esim.id, id)).for("update");
    if (!saved || (retryMissingQr ? saved.qrCodeUrl : saved.detailsFetchedAt)) return;

    const fetchedAt = new Date();
    // TODO: swap the dummy below for the real SimJuno lookup.
    // const details = detailsResponse.parse(
    //   await simjuno.esim.getEsim(
    //     { id: saved.providerEsimId },
    //     { timeoutInSeconds: 8, maxRetries: 0 },
    //   ),
    // );
    const ac = "LPA:1$smdp.example.com$DUMMY-ACTIVATION-CODE";
    const details = detailsResponse.parse({
      id: saved.providerEsimId,
      esimStatus: "GOT_RESOURCE",
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=224x224&data=${encodeURIComponent(ac)}`,
      shortUrl: null,
      ac,
      dataUsage: 0,
      totalData: 1024 ** 3,
      expired_time: new Date(Date.now() + 30 * 86_400_000).toISOString(),
    });
    if (details.id !== saved.providerEsimId) throw new Error("Provider eSIM mismatch.");

    await tx
      .update(esim)
      .set({
        status: details.esimStatus,
        qrCodeUrl: details.qrCodeUrl,
        shortUrl: details.shortUrl,
        activationCode: details.ac,
        dataUsage: details.dataUsage,
        totalData: details.totalData,
        expiresAt: details.expired_time,
        detailsFetchedAt: fetchedAt,
        statusUpdatedAt: fetchedAt,
        usageUpdatedAt: fetchedAt,
        validityUpdatedAt: fetchedAt,
      })
      .where(eq(esim.id, saved.id));
  });
}

// Refreshes saved installation details when the QR code is still missing.
export async function refreshEsimDetails(id: string) {
  await fetchAndSaveDetails(id, true);
}

// Saves initial eSIM details after SimJuno reports that the order is ready.
export async function initializeEsimFromWebhook(event: SimjunoEvent) {
  const data = z
    .object({ transactionId: z.string().min(1), orderStatus: z.literal("GOT_RESOURCE") })
    .parse(event.data);
  const [saved] = await db
    .select({ orderId: order.id, esimId: esim.id })
    .from(order)
    .leftJoin(esim, eq(esim.orderId, order.id))
    .where(eq(order.id, data.transactionId));
  if (!saved) return;
  if (!saved.esimId) throw new Error("The provider eSIM has not been saved yet.");
  await fetchAndSaveDetails(saved.esimId, false);
}

// Saves a newer eSIM status received from SimJuno.
export async function updateEsimStatusFromWebhook(event: SimjunoEvent) {
  const createdAt = new Date(event.created_at);
  const data = statusEvent.parse(event.data);
  if (!data.esimStatus) return;
  await db
    .update(esim)
    .set({ status: data.esimStatus, statusUpdatedAt: createdAt })
    .where(
      and(
        eq(esim.orderId, data.transactionId),
        eq(esim.providerEsimId, data.esimId),
        or(isNull(esim.statusUpdatedAt), lte(esim.statusUpdatedAt, createdAt)),
      ),
    );
}

// Saves newer eSIM usage totals received from SimJuno.
export async function updateEsimUsageFromWebhook(event: SimjunoEvent) {
  const createdAt = new Date(event.created_at);
  const data = usageEvent.parse(event.data);
  if (data.orderUsage === undefined || data.totalVolume === undefined) return;
  await db
    .update(esim)
    .set({
      dataUsage: data.orderUsage,
      totalData: data.totalVolume,
      usageUpdatedAt: createdAt,
    })
    .where(
      and(
        eq(esim.orderId, data.transactionId),
        eq(esim.providerEsimId, data.esimId),
        or(isNull(esim.usageUpdatedAt), lte(esim.usageUpdatedAt, createdAt)),
      ),
    );
}

// Saves a newer eSIM expiration time received from SimJuno.
export async function updateEsimValidityFromWebhook(event: SimjunoEvent) {
  const createdAt = new Date(event.created_at);
  const data = validityEvent.parse(event.data);
  if (!data.expiredTime) return;
  await db
    .update(esim)
    .set({ expiresAt: data.expiredTime, validityUpdatedAt: createdAt })
    .where(
      and(
        eq(esim.orderId, data.transactionId),
        eq(esim.providerEsimId, data.esimId),
        or(isNull(esim.validityUpdatedAt), lte(esim.validityUpdatedAt, createdAt)),
      ),
    );
}
