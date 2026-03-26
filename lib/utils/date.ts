import { format, toZonedTime } from "date-fns-tz";

export function getGMT8Date(date: Date = new Date()) {
  return toZonedTime(date, "Asia/Singapore");
}

export function convertToUTC(date: Date) {
  return new Date(date.toISOString());
}

export function getDeliveryDateFormat(date: Date) {
  return format(getGMT8Date(date), "dd-MM-yyyy");
}

export function parseDDMMYYYYToDate(dateStr: string | null): string | null {
  if (!dateStr) return null;

  try {
    const parts = dateStr.trim().split("/");
    if (parts.length !== 3) {
      throw new Error("Invalid date format, expected dd/MM/yyyy");
    }
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error("Invalid date parts");
    }

    // Months are 0-indexed in JavaScript Date
    const utcDate = new Date(Date.UTC(year, month - 1, day));

    if (isNaN(utcDate.getTime())) {
      throw new Error("Invalid date created");
    }

    return utcDate.toISOString().split("T")[0];
  } catch (error) {
    console.error("Failed to parse DD/MM/YYYY date:", dateStr, error);
    return null;
  }
}

export function parseInputDateToDate(
  dateStr: string | undefined,
): string | null {
  if (!dateStr) return null;
  try {
    // Parse as YYYY-MM-DD and return the same date string to avoid timezone issues
    const parts = dateStr.split("-");
    if (parts.length === 3 && parts[0].length === 4) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        // Create UTC date to avoid timezone conversion issues
        const utcDate = new Date(Date.UTC(year, month - 1, day));
        return utcDate.toISOString().split("T")[0];
      }
    }
    throw new Error("Invalid YYYY-MM-DD format");
  } catch (error) {
    console.error("Failed to parse YYYY-MM-DD input date:", dateStr, error);
    return null;
  }
}

export function parseFlexibleDateFormat(
  dateStr: string | null | undefined,
): string | null {
  if (!dateStr) return null;

  try {
    const trimmed = dateStr.trim();

    if (trimmed.includes("/")) {
      const parts = trimmed.split("/");
      if (parts.length === 3 && parts[0].length === 2) {
        return parseDDMMYYYYToDate(trimmed);
      }
    }

    if (trimmed.includes("-")) {
      const parts = trimmed.split("-");
      if (parts.length === 3) {
        if (parts[0].length === 2) {
          const rearranged = `${parts[2]}-${parts[1]}-${parts[0]}`;
          return parseInputDateToDate(rearranged);
        } else if (parts[0].length === 4) {
          return parseInputDateToDate(trimmed);
        }
      }
    }

    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }

    return null;
  } catch (error) {
    console.error("Failed to parse flexible date format:", dateStr, error);
    return null;
  }
}

export function getTodaysDateString(): string {
  return new Date().toISOString().split("T")[0];
}
