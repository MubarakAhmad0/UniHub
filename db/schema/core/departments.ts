import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";

export const departments = pgTable("departments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  ...timestamps,
});
