"use server";

import { db } from "@/db";
import { stockTransfers } from "@/db/schema";
import { handleApiRequest } from "@/scripts/helper";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateStatus(stId: number) {
  return handleApiRequest(async () => {
    // dalam server action tak boleh guna hook useUser so kita retrieve dari cookies.
    const storedUser = (await cookies()).get("user")?.value;

    if (!storedUser) {
      throw new Error("Unauthorized");
    }

    const user = JSON.parse(storedUser);

    const updatedStatus = await db
      .update(stockTransfers)
      .set({
        status: "PROCESSING",
        processingAt: new Date(),
        processingBy: user.id,
      })
      .where(eq(stockTransfers.id, stId))
      .returning();

    revalidatePath("/scm/stock-transfers");
    return updatedStatus;
  });
}
