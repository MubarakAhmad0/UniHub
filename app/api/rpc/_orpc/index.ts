import { RPCHandler } from "@orpc/server/fetch";
export const router = {};

const handler = new RPCHandler(router);

export async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: {
      headers: request.headers,
    },
  });

  return response ?? new Response("Not found", { status: 404 });
}
