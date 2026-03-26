import { pgTable, smallint, text } from "drizzle-orm/pg-core";
import { timestamps } from "./utils";

export const statusMasterEnum = Object.freeze({
  ASSIGNED_TO_GROUP: "ASSIGNED_TO_GROUP",
  IN_PROGRESS: "IN_PROGRESS",
  DRIVER_ASSIGNED: "DRIVER_ASSIGNED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  RETURN: "RETURN",
  FAILED_DELIVERY: "FAILED_DELIVERY",
  IN_RETURN_DELIVERY: "IN_RETURN_DELIVERY",
  RETURNED_TO_WAREHOUSE: "RETURNED_TO_WAREHOUSE",
  RESCHEDULED: "RESCHEDULED",
  PENDING_ASSIGNMENT: "PENDING_ASSIGNMENT",
  COMPLETED: "COMPLETED",
  COMPLETE_RETURN: "COMPLETE_RETURN",
  PACKING_IN_PROGRESS: "PACKING_IN_PROGRESS",
  PACKED: "PACKED",
  QUALITY_CHECK: "QUALITY_CHECK",
  READY_FOR_DISPATCH: "READY_FOR_DISPATCH",
  CANCELLED: "CANCELLED",
  PENDING_PICK: "PENDING_PICK",
  PREPARED: "PREPARED",
  PREPARING: "PREPARING",
  PENDING: "PENDING",
  PAUSED: "PAUSED",
  DISCARDED: "DISCARDED",
  BLACKMARK: "BLACKMARK",
  JOB_ASSIGNED: "JOB_ASSIGNED",
  PENDING_REVIEW: "PENDING_REVIEW",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  REJECTED: "REJECTED",
  APPROVED: "APPROVED",
  PICKED_UP: "PICKED_UP",
  WIP_PENDING_CURATION: "WIP_PENDING_CURATION",
  WIP_ASSIGNED: "WIP_ASSIGNED",
  WIP_COMPLETED: "WIP_COMPLETED",
  BC_WIP_RECEIVED: "BC_WIP_RECEIVED",
  BC_WIP_SUCCESS: "BC_WIP_SUCCESS",
  BC_WIP_FAILED: "BC_WIP_FAILED",
  PURCHASE_ORDER_RECEIVED: "PO_RECEIVED",
  PRINTED: "PRINTED",
});

export type StatusMasterTypes =
  (typeof statusMasterEnum)[keyof typeof statusMasterEnum];

export const statusMaster = pgTable("status_master", {
  id: smallint("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code")
    .notNull()
    .unique()
    .$type<(typeof statusMasterEnum)[keyof typeof statusMasterEnum]>(),
  type: text("type")
    .notNull()
    .$type<"logistic" | "production" | "pick-pack" | "claim">(),
  description: text("description").notNull(),
  ...timestamps,
});

export type InsertStatusMaster = typeof statusMaster.$inferInsert;
export type StatusMaster = typeof statusMaster.$inferSelect;
