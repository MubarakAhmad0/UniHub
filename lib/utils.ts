import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  } else if (minutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Capitalizes the first letter of each word in a string.
 *
 * This function converts the first character of each word to uppercase,
 * while converting the rest of the characters to lowercase.
 *
 * @param {string} str - The input string to be title-cased
 * @returns {string} The string with each word capitalized
 *
 * @example
 * toTitleCase('delivery failed')     // Returns: 'Delivery Failed'
 * toTitleCase('hello world')         // Returns: 'Hello World'
 * toTitleCase('user_profile_page')   // Returns: 'User Profile Page'
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

type ConvertBigIntToString<T> = T extends bigint
  ? string
  : T extends Array<infer U>
    ? Array<ConvertBigIntToString<U>>
    : T extends object
      ? { [K in keyof T]: ConvertBigIntToString<T[K]> }
      : T;

export function convertBigIntToString<T extends object>(
  obj: T,
): ConvertBigIntToString<T> {
  if (typeof obj !== "object" || obj === null) {
    return obj as ConvertBigIntToString<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      convertBigIntToString(item),
    ) as ConvertBigIntToString<T>;
  }

  const converted = Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (typeof value === "bigint") {
        acc[key] = value.toString();
      } else if (typeof value === "object" && value !== null) {
        acc[key] = convertBigIntToString(value);
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  return converted as ConvertBigIntToString<T>;
}

export const convertBigIntToNumber = (obj: any): any => {
  if (typeof obj === "bigint") {
    return Number(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  }
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertBigIntToNumber(value),
      ]),
    );
  }
  return obj;
};

export function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

export function changeTimezone(date: Date, ianatz: string): Date {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  try {
    // Convert the date to the specified timezone
    const invdate = new Date(
      date.toLocaleString("en-US", {
        timeZone: ianatz,
      }),
    );

    // Calculate the difference in milliseconds
    const diff = date.getTime() - invdate.getTime();

    // Return the adjusted date
    return new Date(date.getTime() - diff);
  } catch (error) {
    console.error("Error converting timezone:", error);
    throw new Error("Invalid timezone provided");
  }
}

export function roundTo(value: number, decimals: number = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
