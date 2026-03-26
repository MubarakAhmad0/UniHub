import { type Permission } from "@/db/schema/auth";
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
  sort: getSortingStateParser<Permission>().withDefault([
    { id: "resource", desc: false },
  ]),

  resource: parseAsString.withDefault(""),
  action: parseAsString.withDefault(""),

  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const createPermissionSchema = z.object({
  resource: z.string().min(1, "resource is required").max(100),
  action: z.string().min(1, "action is required").max(100),
});

export const updatePermissionSchema = z.object({
  resource: z.string().min(1, "resource is required").max(100),
  action: z.string().min(1, "action is required").max(100),
});

export type GetPermissionsSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
export type CreatePermissionSchema = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionSchema = z.infer<typeof updatePermissionSchema>;
