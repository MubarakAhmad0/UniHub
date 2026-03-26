import { index, integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";

export const bcCustomers = pgTable(
  "bc_customers",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    customerNumber: text("customer_number").notNull().unique(),
    name: text("name"),
    address: text("address"),
    address2: text("address2"),
    city: text("city"),
    state: text("state"),
    countryCode: text("country_codes"),
    postcode: text("postcode"),
    ...timestamps,
  },
  (table) => [
    index("bc_customers_customer_number_idx").on(table.customerNumber),
  ],
);
