import { createHmac, timingSafeEqual } from "node:crypto";
import {
  initializeEsimFromWebhook,
  updateEsimStatusFromWebhook,
  updateEsimUsageFromWebhook,
  updateEsimValidityFromWebhook,
} from "@next-js-template/api/lib/esim-sync";
import { env } from "@next-js-template/env/server";
import { z } from "zod";

export const runtime = "nodejs";

const eventSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  version: z.literal("1"),
  created_at: z.iso.datetime({ offset: true }),
  data: z.record(z.string(), z.unknown()),
});

function verify(body: Buffer, signature: string, secret: string) {
  const parts = signature.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => /^t=\d+$/.test(part))?.slice(2);
  if (!timestamp || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.`).update(body).digest();
  return parts.some((part) => {
    if (!/^v1=[a-fA-F0-9]{64}$/.test(part)) return false;
    return timingSafeEqual(expected, Buffer.from(part.slice(3), "hex"));
  });
}

export async function POST(request: Request) {
  if (!env.SIMJUNO_WEBHOOK_SECRET) {
    return Response.json({ error: "Simjuno webhook is not configured." }, { status: 503 });
  }
  const body = Buffer.from(await request.arrayBuffer());
  if (body.length > 1_048_576) return new Response("Payload too large", { status: 413 });
  if (!verify(body, request.headers.get("simjuno-signature") ?? "", env.SIMJUNO_WEBHOOK_SECRET)) {
    return Response.json({ error: "Invalid Simjuno signature." }, { status: 400 });
  }

  let event: z.infer<typeof eventSchema> | undefined;
  try {
    event = eventSchema.parse(JSON.parse(body.toString("utf8")));
    switch (event.type) {
      case "ORDER_STATUS":
        await initializeEsimFromWebhook(event);
        break;
      case "SMDP_EVENT":
      case "ESIM_STATUS":
        await updateEsimStatusFromWebhook(event);
        break;
      case "DATA_USAGE":
        await updateEsimUsageFromWebhook(event);
        break;
      case "VALIDITY_USAGE":
        await updateEsimValidityFromWebhook(event);
        break;
    }
    return Response.json({ received: true });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return Response.json({ error: "Invalid Simjuno event." }, { status: 400 });
    }
    console.error("Unable to process Simjuno event", event?.id, error);
    return Response.json({ error: "Unable to process Simjuno event." }, { status: 500 });
  }
}
