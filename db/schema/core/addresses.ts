import { relations } from "drizzle-orm";
import { bigint, decimal, integer, pgTable, text } from "drizzle-orm/pg-core";
import { addressValidationStatusEnum } from "../enums";
import { customers } from "./customers";

export const addresses = pgTable("addresses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  customerId: bigint({ mode: "number" }).references(() => customers.id),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  address1: text("address1"),
  address2: text("address2"),
  city: text("city"),
  province: text("province"),
  provinceCode: text("province_code"),
  country: text("country"),
  countryCode: text("country_code"),
  zip: text("zip"),
  phone: text("phone"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  googlemapsLatitude: decimal("googlemaps_latitude", {
    precision: 10,
    scale: 7,
  }),
  googlemapsLongitude: decimal("googlemaps_longitude", {
    precision: 10,
    scale: 7,
  }),
  addressValidate:
    addressValidationStatusEnum("address_validate").default("pending"),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  customer: one(customers, {
    fields: [addresses.customerId],
    references: [customers.id],
  }),
  
}));
