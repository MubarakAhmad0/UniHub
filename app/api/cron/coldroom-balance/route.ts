import { db } from "@/db";
import { items, updateItemBalanceLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { executeQuery } from "@/db/mssql";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// create a secret key to secure the endpoint
const CRON_SECRET = process.env.CRON_SECRET || "BT0200-UPDATE-COLDROOM-BALANCE";

export async function GET(request: Request) {
  // verify the secret key
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const notFoundItems: Array<{
    id: number;
    name: string;
    v1ItemId: number;
    reason: string;
  }> = [];

  try {
    // get all flower items with v1_item_id
    const flowerItems = await db.query.items.findMany({
      where: (items, { and, eq, isNotNull }) =>
        and(eq(items.type, "FLOWER"), isNotNull(items.v1ItemId)),
    });

    console.log(`found ${flowerItems.length} flower items with v1_item_id`);

    // process each item
    for (const item of flowerItems) {
      try {
        // first find in BTHQ to get flower_name
        const [bthqItem] = await executeQuery<Array<{ flower_name: string }>>(
          `SELECT flower_name 
                     FROM inventory_flower_master 
                     WHERE id = @itemId 
                     AND TRIM(branch_name) = 'BTHQ'`,
          {
            itemId: item.v1ItemId,
          },
        );

        if (!bthqItem) {
          notFoundItems.push({
            id: item.id,
            name: item.name,
            v1ItemId: item.v1ItemId!,
            reason: "Item not found in BTHQ branch",
          });
          continue;
        }

        // then find in BTKL using flower_name to get balance and unit
        const [btklItem] = await executeQuery<
          Array<{ item_balance: number; unit: string }>
        >(
          `SELECT item_balance, unit 
                     FROM inventory_flower_master 
                     WHERE TRIM(flower_name) = TRIM(@flowerName)
                     AND TRIM(branch_name) = 'BTKL'`,
          {
            flowerName: bthqItem.flower_name,
          },
        );

        if (!btklItem) {
          notFoundItems.push({
            id: item.id,
            name: item.name,
            v1ItemId: item.v1ItemId!,
            reason: "Item not found in BTKL branch",
          });

          // log the failed attempt
          await db.insert(updateItemBalanceLogs).values({
            itemName: item.name,
            branchName: "BTKL",
            oldBalance: item.coldroomBalance?.toString() || "0",
            newBalance: item.coldroomBalance?.toString() || "0", // no change since it failed
            status: "failed",
            errorMessage: "Item not found in BTKL branch",
            apiResponse: { error: "Item not found in BTKL" },
          });
          continue;
        }

        // calculate new balance based on unit type
        let newBalanceValue = btklItem.item_balance || 0;

        // if unit is Bundle and factor exists, multiply by factor
        if (btklItem.unit?.trim().toUpperCase() === "BUNDLE" && item.factor) {
          newBalanceValue = newBalanceValue * Number(item.factor);
        }

        const newBalance = newBalanceValue.toString();

        // update coldroomBalance in current db
        await db
          .update(items)
          .set({
            coldroomBalance: newBalance,
          })
          .where(eq(items.id, item.id));

        // log the successful update
        await db.insert(updateItemBalanceLogs).values({
          itemName: item.name,
          branchName: "BTKL",
          oldBalance: item.coldroomBalance?.toString() || "0",
          newBalance: newBalance,
          status: "success",
          apiResponse: {
            message: "Successfully updated balance",
            oldBalance: item.coldroomBalance,
            newBalance: newBalance,
            originalBalance: btklItem.item_balance,
            unit: btklItem.unit,
            factor: item.factor,
            wasMultiplied: btklItem.unit?.trim().toUpperCase() === "BUNDLE",
          },
        });

        console.log(
          `updated c5 balance for item ${item.name} (id: ${item.id}) to ${newBalance} ${btklItem.unit?.trim().toUpperCase() === "BUNDLE" ? `(original: ${btklItem.item_balance} x factor: ${item.factor})` : ""}`,
        );
      } catch (error) {
        console.error(
          `error processing item ${item.name} (id: ${item.id}):`,
          error,
        );
        notFoundItems.push({
          id: item.id,
          name: item.name,
          v1ItemId: item.v1ItemId!,
          reason: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        });

        // log the error
        await db.insert(updateItemBalanceLogs).values({
          itemName: item.name,
          branchName: "BTKL",
          oldBalance: item.coldroomBalance?.toString() || "0",
          newBalance: item.coldroomBalance?.toString() || "0", // no change since it failed
          status: "failed",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          apiResponse: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "coldroom balance update completed",
      notFoundItems,
    });
  } catch (error) {
    console.error("error updating coldroom balances:", error);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}
