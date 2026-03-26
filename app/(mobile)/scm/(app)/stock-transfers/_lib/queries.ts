"use server";

import { db } from "@/db";
import { stockTransfers } from "@/db/schema";
import { handleApiRequest } from "@/scripts/helper";
import { and, eq, isNull, or, gte, lte } from "drizzle-orm";

// simulate different scenarios for testing
const SIMULATE = {
  ERROR: false, // set to true to simulate error
  EMPTY: false, // set to true to simulate empty data
};

export async function getStockTransfers(isCargoStaff: boolean, date: Date) {
  return handleApiRequest(async () => {
    // simulate error
    if (SIMULATE.ERROR) {
      throw new Error("Failed to fetch stock transfers - simulated error");
    }

    // simulate empty data
    if (SIMULATE.EMPTY) {
      return [];
    }

    // create start and end of day for date filtering
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // check if selected date is before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isHistoricalDate = startOfDay < today;

    const data = await db.query.stockTransfers.findMany({
      where: and(
        // date filter is always applied
        and(
          gte(stockTransfers.createdAt, startOfDay),
          lte(stockTransfers.createdAt, endOfDay),
        ),
        // conditional filters based on user role and date
        isHistoricalDate
          ? undefined // no additional filters for historical dates
          : isCargoStaff
            ? // for cargo staff, show only those that need verification
              and(
                or(
                  eq(stockTransfers.status, "DELIVERING"),
                  eq(stockTransfers.status, "DELIVERING_PARTIAL"),
                ),
                isNull(stockTransfers.receivedAtCargoAt),
              )
            : // for inventory staff, show only pending/processing
              and(
                or(
                  eq(stockTransfers.status, "PENDING"),
                  eq(stockTransfers.status, "PROCESSING"),
                ),
                isNull(stockTransfers.receivedAtCargoAt),
              ),
      ),
      with: {
        branch: true,
        pendingUser: true,
        details: {
          with: {
            item: true,
          },
        },
      },
      orderBy: (stockTransfers, { desc }) => [desc(stockTransfers.createdAt)],
    });

    return data;
  });
}
