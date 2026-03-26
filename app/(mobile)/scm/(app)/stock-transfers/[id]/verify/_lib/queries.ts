import { db } from "@/db";
import { stockTransferDetails } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { handleApiRequest } from "@/scripts/helper";

export async function getItems(stockTransferId: number) {
  return handleApiRequest(async () => {
    const data = await db.query.stockTransferDetails.findMany({
      where: and(
        eq(stockTransferDetails.stockTransferId, stockTransferId),
        gt(stockTransferDetails.fulfilledQuantity, "0"),
      ),
      with: {
        item: {
          columns: {
            id: true,
            name: true,
            unit: true,
            factor: true,
          },
        },
      },
    });

    return data;
  });
}
