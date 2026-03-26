"use server";

import { db } from "@/db";
import { stockTransferDetails, stockTransfers } from "@/db/schema";
import { handleApiRequest } from "@/scripts/helper";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUserFromDb } from "@/db/user";

export async function verifyStockTransfer(
  stockTransferId: number,
  verifiedQuantities: Record<number, number>,
) {
  return await handleApiRequest(async () => {
    const user = await getCurrentUserFromDb();

    if (!user) {
      throw new Error("User not found");
    }

    return await db.transaction(async (tx) => {
      // get parent ST to check status
      const parent = await db.query.stockTransfers.findFirst({
        where: eq(stockTransfers.id, stockTransferId),
      });

      if (!parent) {
        throw new Error("Parent stock transfer not found");
      }

      // update verified quantities for each item
      for (const [detailId, verifiedQty] of Object.entries(
        verifiedQuantities,
      )) {
        await tx
          .update(stockTransferDetails)
          .set({
            fulfilledQuantity: verifiedQty.toString(),
          })
          .where(
            and(
              eq(stockTransferDetails.id, parseInt(detailId)),
              eq(stockTransferDetails.stockTransferId, stockTransferId),
            ),
          );
      }

      // update stock transfer status based on current status
      const newStatus =
        parent.status === "DELIVERING"
          ? "RECEIVED_AT_CARGO"
          : "RECEIVED_AT_CARGO_PARTIAL";

      await tx
        .update(stockTransfers)
        .set({
          status: newStatus,
          receivedAtCargoAt: new Date(),
          receivedAtCargoBy: user.id,
        })
        .where(eq(stockTransfers.id, stockTransferId));

      revalidatePath("/scm/stock-transfers");

      return { success: true };
    });
  });
}
