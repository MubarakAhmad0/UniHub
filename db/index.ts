import "dotenv/config";
import { Logger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log("[DATABASE]", { query, params });
  }
}

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  console.warn(
    "[DATABASE] DB_URL environment variable is not set. Database operations will fail at runtime.",
  );
}

// Use a placeholder connection string if DB_URL is not set — queries will fail gracefully
export const db = drizzle(
  dbUrl || "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  {
    schema,
    logger:
      process.env.DATABASE_LOGS === "true" ? new CustomLogger() : undefined,
  },
);
