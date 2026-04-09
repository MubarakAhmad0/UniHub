import { users, departments } from "@/db/schema";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";

import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import type { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type Department = InferSelectModel<typeof departments>;

export const searchParamsCache = createSearchParamsCache({
  flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault(
    [],
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<User>().withDefault([
    { id: "name", desc: false },
  ]),

  name: parseAsString.withDefault(""),
  username: parseAsString.withDefault(""),
  email: parseAsString.withDefault(""),

  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().optional(),
  phoneNumber: z.string().optional(),
  jobTitle: z.string().optional(),
  roleIds: z.array(z.number()).min(1, "At least one role is required"),
  departmentId: z.number().optional(),
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  displayUsername: z.string().optional(),
  phoneNumberVerified: z.boolean().optional(),
});

// Backward compatibility schema for single role (legacy support)
export const updateUserSchemaLegacy = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  phoneNumber: z.string().optional(),
  jobTitle: z.string().optional(),
  roleId: z.number().min(1, "Role is required"),
  departmentId: z.number().optional(),
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  displayUsername: z.string().optional(),
  phoneNumberVerified: z.boolean().optional(),
});

export type GetUsersSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UpdateUserSchemaLegacy = z.infer<typeof updateUserSchemaLegacy>;

export const userFormSchema = updateUserSchema;

export type UserFormData = z.infer<typeof userFormSchema>;
