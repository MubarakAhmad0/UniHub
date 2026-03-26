"use server";

import { db } from "@/db";
import {
  items,
  stockTransferDetails,
  stockTransfers,
  updateItemBalanceLogs,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { STDetailsWithItem } from "../_components/items";
import { handleApiRequest } from "@/scripts/helper";
import { cookies } from "next/headers";
import { executeQuery } from "@/db/mssql";

export async function fulfillStockTransfer(
  stockTransferId: number,
  fulfilledItems: STDetailsWithItem[],
  unfulfilledItems: STDetailsWithItem[],
  fulfilledQuantities: Record<number, number>,
) {
  return await handleApiRequest(async () => {
    const storedUser = (await cookies()).get("user")?.value;
    if (!storedUser) {
      throw new Error("Unauthorized");
    }
    const user = JSON.parse(storedUser);

    return await db.transaction(async (tx) => {
      // get parent ST
      const parent = await db.query.stockTransfers.findFirst({
        where: eq(stockTransfers.id, stockTransferId),
      });

      if (!parent) {
        throw new Error("Parent stock transfer not found");
      }

      // update fully fulfilled items for parent ST
      for (const item of fulfilledItems) {
        const fulfilledQty = fulfilledQuantities[item.id] || 0;
        const requiredQty = Number(item.baseQuantity);

        // this shouldnt be happening because we have already validate in frontend
        if (fulfilledQty < 0 || fulfilledQty > requiredQty) {
          throw new Error(
            `Invalid fulfilled quantity for item ${item.item.name}`,
          );
        }

        await tx
          .update(stockTransferDetails)
          .set({
            fulfilledQuantity: fulfilledQty.toString(),
          })
          .where(
            and(
              eq(stockTransferDetails.id, item.id),
              eq(stockTransferDetails.stockTransferId, stockTransferId),
            ),
          );

        // TODO: uncomment this when we want to update item balance in old db
        // update item balance in old db
        const update = await updateItemBalanceInOldDb(
          item.itemId,
          item.item.name,
          "BTHQ", // hardcode because we want to update BTHQ balance always
          fulfilledQty,
          stockTransferId,
        );

        // TODO: find a way to catch error from updateItemBalanceInOldDb
      }

      // update parent status
      const status =
        unfulfilledItems.length > 0 ? "DELIVERING_PARTIAL" : "DELIVERING";
      await tx
        .update(stockTransfers)
        .set({
          status,
          deliveringAt: status === "DELIVERING" ? new Date() : null,
          deliveringBy: user.id,
          deliveringPartialAt:
            status === "DELIVERING_PARTIAL" ? new Date() : null,
          deliveringPartialBy: user.id,
        })
        .where(eq(stockTransfers.id, stockTransferId));

      // create partial ST if there are unfulfilled items in parent ST
      if (unfulfilledItems.length > 0) {
        const [partialST] = await tx
          .insert(stockTransfers)
          .values({
            stNumber: "",
            branchId: parent.branchId,
            status: "PENDING",
            pendingBy: parent.pendingBy,
            pendingAt: parent.pendingAt,
            parentStId: stockTransferId,
            type: "STANDARD",
          })
          .returning({ id: stockTransfers.id });

        await tx
          .update(stockTransfers)
          .set({ stNumber: `ST${partialST.id}` })
          .where(eq(stockTransfers.id, partialST.id));

        // create stock transfer details for unfulfilled items (partial ST)
        await Promise.all(
          unfulfilledItems.map(async (item) => {
            const fulfilledQty = fulfilledQuantities[item.id] || 0;
            const adjustedQuantity = Number(item.adjustedQuantity);
            const remainingQty = adjustedQuantity - fulfilledQty;

            if (remainingQty <= 0) {
              throw new Error(
                `Invalid remaining quantity for item ${item.item.name}`,
              );
            }

            // update parent ST detail with actual fulfilled quantity
            await tx
              .update(stockTransferDetails)
              .set({
                fulfilledQuantity: fulfilledQty.toString(),
              })
              .where(
                and(
                  eq(stockTransferDetails.id, item.id),
                  eq(stockTransferDetails.stockTransferId, stockTransferId),
                ),
              );

            return tx.insert(stockTransferDetails).values({
              stockTransferId: partialST.id,
              itemId: item.itemId,
              baseQuantity: remainingQty.toString(),
              adjustedQuantity: remainingQty.toString(),
              fulfilledQuantity: "0",
            });
          }),
        );
      }

      revalidatePath(`/scm/stock-transfers`);

      return {
        status,
        message:
          "Stock transfer submitted successfully! (Some items may not update in old system)",
      };
    });
  });
}

export async function updateItemBalanceInOldDb(
  itemId: number,
  itemName: string,
  branchName: string,
  quantity: number,
  stockTransferId: number,
) {
  try {
    // first get the v1ItemId from our items table
    const item = await db.query.items.findFirst({
      where: eq(items.id, itemId),
    });

    // construct query based on whether v1ItemId exists
    const [itemInOldDb] = await executeQuery<
      Array<{
        id: number;
        item_balance: number;
        unit: string;
        factor: number;
      }>
    >(
      item?.v1ItemId
        ? `SELECT * 
            FROM inventory_flower_master 
            WHERE TRIM(branch_name) = TRIM(@branchName) 
            AND id = @v1ItemId`
        : `SELECT * 
            FROM inventory_flower_master 
            WHERE TRIM(branch_name) = TRIM(@branchName) 
            AND TRIM(flower_name) = TRIM(@itemName)`,
      {
        branchName: branchName.trim(),
        ...(item?.v1ItemId
          ? { v1ItemId: item.v1ItemId }
          : { itemName: itemName.trim() }),
      },
    );

    if (!itemInOldDb) {
      await db.insert(updateItemBalanceLogs).values({
        itemName,
        branchName,
        quantity: quantity.toString(),
        oldBalance: null,
        newBalance: null,
        status: "failed",
        errorMessage: "Item not found in old system",
        apiResponse: null,
        stockTransferId,
      });

      return {
        success: false,
        message: "Item not found in old system",
        data: null,
      };
    }

    // calculate deduction quantity based on unit
    const deductionQuantity =
      itemInOldDb.unit === "Bundle" && itemInOldDb.factor
        ? quantity / itemInOldDb.factor
        : quantity;

    // attempt to update in old system
    const [updatedOldItem] = await executeQuery<
      Array<{
        id: number;
        item_balance: number;
        unit: string;
      }>
    >(
      `/*
       mssql requires table variable to capture output from update statements.
       this workaround lets us retrieve updated values in single query execution:
       1. declare temp table to store results
       2. perform update with output into temp table
       3. select from temp table to return results
       */
      DECLARE @UpdatedTable TABLE (id INT, item_balance DECIMAL(18,2), unit VARCHAR(50));
      
      UPDATE inventory_flower_master 
      SET item_balance = @oldItemBalance - @quantity
      OUTPUT inserted.id, inserted.item_balance, inserted.unit INTO @UpdatedTable
      WHERE TRIM(branch_name) = TRIM(@branchName) 
      ${item?.v1ItemId ? "AND id = @v1ItemId" : "AND TRIM(flower_name) = TRIM(@itemName)"};
      
      SELECT * FROM @UpdatedTable;`,
      {
        branchName: branchName.trim(),
        ...(item?.v1ItemId
          ? { v1ItemId: item.v1ItemId }
          : { itemName: itemName.trim() }),
        oldItemBalance: itemInOldDb.item_balance,
        quantity: deductionQuantity,
      },
    );

    // TODO: add audit log for item balance update in v1

    if (!updatedOldItem) {
      await db.insert(updateItemBalanceLogs).values({
        itemName,
        branchName,
        quantity: quantity.toString(),
        oldBalance: itemInOldDb.item_balance.toString(),
        newBalance: (itemInOldDb.item_balance - deductionQuantity).toString(),
        status: "failed",
        errorMessage: "Failed to update item balance in old db",
        apiResponse: null,
        stockTransferId,
      });

      return {
        success: false,
        message: "Failed to update item balance in old db",
        data: null,
      };
    }

    await db.insert(updateItemBalanceLogs).values({
      itemName,
      branchName,
      quantity: quantity.toString(),
      oldBalance: itemInOldDb.item_balance.toString(),
      newBalance: updatedOldItem.item_balance.toString(),
      status: "success",
      errorMessage: null,
      apiResponse: updatedOldItem,
      stockTransferId: stockTransferId,
    });

    return {
      success: true,
      message: "Item balance updated in old db",
      data: updatedOldItem,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "unknown error";

    await db.insert(updateItemBalanceLogs).values({
      itemName,
      branchName,
      quantity: quantity.toString(),
      oldBalance: null,
      newBalance: null,
      status: "failed",
      errorMessage,
      apiResponse: null,
      stockTransferId,
    });

    return {
      success: false,
      message: `failed to update item balance: ${errorMessage}`,
      data: null,
    };
  }
}
