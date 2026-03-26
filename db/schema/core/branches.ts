import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const branches = pgTable("branches", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name"),
  code: text("code"),
});

export const branchesRelations = relations(branches, ({ many }) => ({
  users: many(users),
}));
