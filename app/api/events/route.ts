import { NextRequest } from "next/server";
import { groupEvents, GroupUpdate } from "@/lib/event-emitter";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const clientType = searchParams.get("type");

  if (clientType !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

      const handleGroupUpdate = (update: GroupUpdate) => {
        const data = JSON.stringify({
          type: "delivery_group_status_changed",
          data: update,
        });
        controller.enqueue(`data: ${data}\n\n`);
      };

      groupEvents.on("group_update", handleGroupUpdate);

      const listenerCount = groupEvents.listenerCount("group_update");
      console.log(
        "👂 EventEmitter listener count for group_update:",
        listenerCount,
      );

      const cleanup = () => {
        console.log("🧹 Cleaning up SSE event listeners");
        groupEvents.off("group_update", handleGroupUpdate);
      };

      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
