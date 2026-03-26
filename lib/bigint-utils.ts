import SuperJSON from "superjson";

export function convertBigIntToNumber(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return Number(obj);
  if (Array.isArray(obj)) return obj.map(convertBigIntToNumber);
  if (typeof obj === "object") {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToNumber(value);
    }
    return converted;
  }
  return obj;
}

/**
 * Safe JSON.stringify that handles BigInt values
 */
export function safeJSONStringify(data: any, space?: string | number): string {
  return JSON.stringify(
    data,
    (key, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }
      return value;
    },
    space,
  );
}

/**
 * Safe SuperJSON.stringify that handles BigInt values
 */
export async function safeSuperJSONStringify(data: any): Promise<string> {
  return SuperJSON.stringify(convertBigIntToNumber(data));
}

/**
 * Global BigInt serialization setup for JSON.stringify
 * Call this once in your app to make JSON.stringify handle BigInt automatically
 */
export function setupBigIntSerialization() {
  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    return Number(this);
  };
}
