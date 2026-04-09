import "server-only";

/**
 * Status codes used across the application.
 * These map to entries in the status_master table when it exists.
 * Until then, these are used as plain string codes.
 */
export type StatusMasterTypes = string;

/**
 * Gets a status ID by its code.
 * Currently returns a hash of the code since the status_master table doesn't exist yet.
 *
 * @param code - The status code
 * @returns The status ID (hashed from code)
 *
 * @example
 * ```typescript
 * const statusId = await getStatusIdByCode("WIP_ASSIGNED");
 * ```
 */
export async function getStatusIdByCode(
  code: StatusMasterTypes,
): Promise<number> {
  // Generate a consistent numeric ID from the code string
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = ((hash << 5) - hash + code.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Gets multiple status IDs by their codes.
 *
 * @param codes - Array of status codes
 * @returns Object mapping code to ID
 *
 * @example
 * ```typescript
 * const statuses = await getStatusIdsByCodes(["WIP_ASSIGNED", "WIP_COMPLETED"]);
 * console.log(statuses.WIP_ASSIGNED); // hashed value
 * console.log(statuses.WIP_COMPLETED); // hashed value
 * ```
 */
export async function getStatusIdsByCodes(
  codes: StatusMasterTypes[],
): Promise<Record<StatusMasterTypes, number>> {
  const result: Record<StatusMasterTypes, number> = {};
  for (const code of codes) {
    result[code] = await getStatusIdByCode(code);
  }
  return result;
}
