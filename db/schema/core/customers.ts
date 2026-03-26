import { relations } from "drizzle-orm";
import { bigint, boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { addresses } from "./addresses";
import { bcCustomers } from "./bc-customers";

export const customers = pgTable("customers", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  bcCustomerId: integer("bc_customer_id").references(() => bcCustomers.id),
  state: text("state"),
  verifiedEmail: boolean("verified_email"),
  phone: text("phone"),
  tags: text("tags"),
  currency: text("currency"),
  ...timestamps,
});

export const customersRelations = relations(customers, ({ one, many }) => ({
  addresses: many(addresses),
  bcCustomer: one(bcCustomers, {
    fields: [customers.bcCustomerId],
    references: [bcCustomers.id],
  }),
}));
