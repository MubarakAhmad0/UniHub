import "server-only";

import { db } from "@/db";
import { roles, rolesToPermissions } from "@/db/schema/auth";
import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";

import { filterColumns } from "@/lib/filter-columns";
import { unstable_cache } from "@/lib/unstable-cache";

import { type GetRolesSchema } from "./validations";

export async function getRoles(input: GetRolesSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;
        const advancedTable = input.flags.includes("advancedTable");

        const advancedWhere = filterColumns({
          table: roles,
          filters: input.filters,
          joinOperator: input.joinOperator,
        });

        const where = advancedTable
          ? advancedWhere
          : and(
              input.key ? ilike(roles.key, `%${input.key}%`) : undefined,
              input.description
                ? ilike(roles.description, `%${input.description}%`)
                : undefined,
            );

        const orderBy =
          input.sort.length > 0
            ? input.sort.map((item) =>
                item.desc ? desc(roles[item.id]) : asc(roles[item.id]),
              )
            : [asc(roles.key)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              id: roles.id,
              description: roles.description,
              key: roles.key,
              name: roles.name,
              permissionCount:
                sql<number>`count(${rolesToPermissions.permissionId})`.mapWith(
                  Number,
                ),
              createdAt: roles.createdAt,
              updatedAt: roles.updatedAt,
            })
            .from(roles)
            .leftJoin(
              rolesToPermissions,
              eq(roles.id, rolesToPermissions.roleId),
            )
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .groupBy(
              roles.id,
              roles.description,
              roles.key,
              roles.name,
              roles.createdAt,
              roles.updatedAt,
            )
            .orderBy(...orderBy);

          const total = await tx
            .select({
              count: count(),
            })
            .from(roles)
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
        console.error("getRoles error:", err);
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: ["roles"],
    },
  )();
}
