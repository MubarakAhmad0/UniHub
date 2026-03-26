import { type Role } from "@/db/schema/auth";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";

import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";

export const searchParamsCache = createSearchParamsCache({
  flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault(
    [],
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Role>().withDefault([{ id: "key", desc: false }]),

  key: parseAsString.withDefault(""),
  description: parseAsString.withDefault(""),

  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const createRoleSchema = z.object({
  key: z.string().min(1, "key is required").max(100),
  name: z.string().min(1, "name is required").max(100),
  description: z.string().max(255).optional(),
});

export const updateRoleSchema = z.object({
  key: z.string().min(1, "key is required").max(100),
  name: z.string().min(1, "name is required").max(100),
  description: z.string().max(255).optional(),
});

export type GetRolesSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
export type CreateRoleSchema = z.infer<typeof createRoleSchema>;
export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;
