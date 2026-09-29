import { router as appRouter } from "@next-js-template/api";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ResponseHeadersPlugin, StrictGetMethodPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import type { NextRequest } from "next/server";

export const maxDuration = 60;

const rpcHandler = new RPCHandler(appRouter, {
  plugins: [new StrictGetMethodPlugin(), new ResponseHeadersPlugin()],
  interceptors: [onError((error) => console.error(error))],
});
const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new ResponseHeadersPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [onError((error) => console.error(error))],
});

async function handleRequest(req: NextRequest) {
  // RPC otherwise accepts HEAD for mutations too. Only GET may be read-only.
  if (req.method === "HEAD") return new Response(null, { status: 405 });
  if (req.method !== "GET") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    let sameOrigin = !origin;
    if (origin) {
      try {
        sameOrigin = new URL(origin).host === host;
      } catch {
        sameOrigin = false;
      }
    }
    if (req.headers.get("sec-fetch-site") === "cross-site" || !sameOrigin) {
      return new Response("Forbidden", { status: 403 });
    }
  }
  const context = { headers: req.headers };
  const finish = (response: Response) => {
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  };
  const rpcResult = await rpcHandler.handle(req, { prefix: "/api/rpc", context });
  if (rpcResult.response) return finish(rpcResult.response);

  const apiResult = await apiHandler.handle(req, {
    prefix: "/api/rpc",
    context,
  });
  if (apiResult.response) return finish(apiResult.response);

  return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
