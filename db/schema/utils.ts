import { boolean, timestamp } from "drizzle-orm/pg-core";

// Timestamps
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
};

export const softDelete = {
  deletedAt: timestamp("deleted_at"),
  isDeleted: boolean("is_deleted").default(false).notNull(),
};

export type Timestamps = typeof timestamps;
export type SoftDelete = typeof softDelete;
