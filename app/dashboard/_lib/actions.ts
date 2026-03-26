import { db } from "@/db";
import { changeTimezone } from "@/lib/utils";
import { and, eq, gte, lt, sql } from "drizzle-orm";

export async function getDashboardSummary() {
  const result = await db.transaction(async (tx) => {
    // Set up date ranges
    const today = new Date();
    today.setDate(today.getDate() - 1); // Set to asia time zone (-8 hours)
    today.setUTCHours(10, 0, 0, 0); // Set to start of the day

    const tomorrow = changeTimezone(new Date(today), "Asia/Singapore");
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const dayAfterTomorrow = changeTimezone(
      new Date(tomorrow),
      "Asia/Singapore",
    );
    dayAfterTomorrow.setUTCDate(dayAfterTomorrow.getUTCDate() + 1);


    return {
    };
  });

  return result;
}

export type DashboardSummary = Awaited<ReturnType<typeof getDashboardSummary>>;
