import "server-only";

import { db } from "@/db";
import { statusMaster, type StatusMasterTypes } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

/**
 * Gets a status ID by its code.
 * This ensures lookups work across different environments where status IDs might differ,
 * but status codes remain consistent.
 *
 * @param code - The status code from statusMasterEnum
 * @returns The status ID
 * @throws Error if status is not found
 *
 * @example
 * ```typescript
 * const statusId = await getStatusIdByCode("WIP_ASSIGNED");
 * ```
 */
export async function getStatusIdByCode(
  code: StatusMasterTypes,
): Promise<number> {
  const status = await db.query.statusMaster.findFirst({
    where: eq(statusMaster.code, code),
    columns: { id: true },
  });

  if (!status) {
    throw new Error(`Status not found for code: ${code}`);
  }

  return status.id;
}

/**
 * Gets multiple status IDs by their codes in a single query.
 * More efficient than multiple individual lookups.
 *
 * @param codes - Array of status codes
 * @returns Object mapping code to ID
 * @throws Error if any status is not found
 *
 * @example
 * ```typescript
 * const statuses = await getStatusIdsByCodes(["WIP_ASSIGNED", "WIP_COMPLETED"]);
 * console.log(statuses.WIP_ASSIGNED); // 32
 * console.log(statuses.WIP_COMPLETED); // 33
 * ```
 */
export async function getStatusIdsByCodes(
  codes: StatusMasterTypes[],
): Promise<Record<StatusMasterTypes, number>> {
  const statuses = await db.query.statusMaster.findMany({
    where: inArray(statusMaster.code, codes),
    columns: { id: true, code: true },
  });

  const foundCodes = statuses.map((s) => s.code);
  const missingCodes = codes.filter((code) => !foundCodes.includes(code));

  if (missingCodes.length > 0) {
    throw new Error(`Status not found for codes: ${missingCodes.join(", ")}`);
  }

  return statuses.reduce(
    (acc, status) => {
      acc[status.code] = status.id;
      return acc;
    },
    {} as Record<StatusMasterTypes, number>,
  );
}
