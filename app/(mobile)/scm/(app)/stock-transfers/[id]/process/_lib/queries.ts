import { db } from "@/db";
import { stockTransferDetails } from "@/db/schema";
import { eq } from "drizzle-orm";
import { handleApiRequest } from "@/scripts/helper";

export async function getItems(stockTransferId: number) {
  return handleApiRequest(async () => {
    const data = await db.query.stockTransferDetails.findMany({
      where: eq(stockTransferDetails.stockTransferId, stockTransferId),
      with: {
        item: true,
      },
      orderBy: (stockTransferDetails, { desc }) => [
        desc(stockTransferDetails.id),
      ],
    });

    return data;
  });
}
