import "dotenv/config";
import { Logger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log("[DATABASE]", { query, params });
  }
}

export const db = drizzle(process.env.DB_URL!, {
  schema,
  logger: process.env.DATABASE_LOGS === "true" ? new CustomLogger() : undefined,
});
