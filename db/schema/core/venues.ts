import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";

export const venueTypeEnum = pgEnum("venue_type", [
  "CLASSROOM",
  "LECTURE_HALL",
  "LAB",
  "STUDIO",
  "MEETING_ROOM",
  "AUDITORIUM",
  "SPORTS",
]);

export const venueStatusEnum = pgEnum("venue_status", [
  "AVAILABLE",
  "OCCUPIED",
  "MAINTENANCE",
  "CLOSED",
]);

export const venues = pgTable("venues", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  building: text("building"),
  floor: integer("floor"),
  capacity: integer("capacity"),
  type: venueTypeEnum("type").default("CLASSROOM"),
  status: venueStatusEnum("default").default("AVAILABLE"),
  facilities: text("facilities").array(),
  description: text("description"),
  ...timestamps,
});

export type Venue = typeof venues.$inferSelect;
export type NewVenue = typeof venues.$inferInsert;
