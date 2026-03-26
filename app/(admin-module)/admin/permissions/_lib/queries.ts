import "server-only";

import { db } from "@/db";
import { permissions } from "@/db/schema/auth";
import { and, asc, count, desc, ilike } from "drizzle-orm";

import { filterColumns } from "@/lib/filter-columns";
import { unstable_cache } from "@/lib/unstable-cache";

import { type GetPermissionsSchema } from "./validations";

export async function getPermissions(input: GetPermissionsSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;
        const advancedTable = input.flags.includes("advancedTable");

        const advancedWhere = filterColumns({
          table: permissions,
          filters: input.filters,
          joinOperator: input.joinOperator,
        });

        const where = advancedTable
          ? advancedWhere
          : and(
              input.resource
                ? ilike(permissions.resource, `%${input.resource}%`)
                : undefined,
              input.action
                ? ilike(permissions.action, `%${input.action}%`)
                : undefined,
            );

        const orderBy =
          input.sort.length > 0
            ? input.sort.map((item) =>
                item.desc
                  ? desc(permissions[item.id])
                  : asc(permissions[item.id]),
              )
            : [asc(permissions.resource)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select()
            .from(permissions)
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = await tx
            .select({
              count: count(),
            })
            .from(permissions)
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0);

          return {
            data,
            total,
          };
        });

        const pageCount = Math.ceil(total / input.perPage);
        return { data, pageCount };
      } catch (err) {
        console.error("getPermissions error:", err);
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: ["permissions"],
    },
  )();
}
