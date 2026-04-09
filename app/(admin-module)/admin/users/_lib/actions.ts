"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { accounts, roles, userRoles } from "@/db/schema/auth";
import { auth } from "@/lib/auth";
import { filterColumns } from "@/lib/filter-columns";
import { getErrorMessage } from "@/lib/handle-error";
import { unstable_cache } from "@/lib/unstable-cache";
import type { InferSelectModel } from "drizzle-orm";
import { and, asc, count, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { revalidateTag, unstable_noStore } from "next/cache";
import {
  GetUsersSchema,
  UpdateUserSchema,
  UpdateUserSchemaLegacy,
} from "./validations";

export async function getUsers(input: GetUsersSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;
        const advancedTable = input.flags.includes("advancedTable");

        const advancedWhere = filterColumns({
          table: users,
          filters: input.filters,
          joinOperator: input.joinOperator,
        });

        const where = advancedTable
          ? advancedWhere
          : and(
              input.name ? ilike(users.name, `%${input.name}%`) : undefined,
              input.email ? ilike(users.email, `%${input.email}%`) : undefined,
              input.username
                ? ilike(users.username, `%${input.username}%`)
                : undefined,
            );

        const orderBy =
          input.sort.length > 0
            ? input.sort.map((item) => {
                const col = (users as Record<string, any>)[item.id];
                if (col) {
                  return item.desc ? desc(col) : asc(col);
                }
                return asc(users.name);
              })
            : [asc(users.name)];

        const { data, total } = await db.transaction(async (tx) => {
          const rawData = await tx
            .select({
              users,
              accounts: sql<
                InferSelectModel<typeof accounts>[]
              >`COALESCE(json_agg(DISTINCT ${accounts}) FILTER (WHERE ${accounts}.id IS NOT NULL), '[]')`,
              roles: sql<
                InferSelectModel<typeof roles>[]
              >`COALESCE(json_agg(DISTINCT ${roles}) FILTER (WHERE ${roles}.id IS NOT NULL), '[]')`,
            })
            .from(users)
            .leftJoin(accounts, eq(users.id, accounts.userId))
            .leftJoin(userRoles, eq(users.id, userRoles.userId))
            .leftJoin(roles, eq(userRoles.roleId, roles.id))
            .where(where)
            .groupBy(users.id)
            .orderBy(...orderBy)
            .limit(input.perPage)
            .offset(offset);

          // Flatten the results to include all info and joined role names
          const data = rawData.map((row) => ({
            ...row.users,
            roles: row.roles || [],
            accounts: row.accounts || [],
            roleNames: row.roles?.map((role) => role.name).join(", ") || "",
          }));

          const total = await tx
            .select({
              count: count(),
            })
            .from(users)
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
        console.error("getUsers error:", err);
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: ["users"],
    },
  )();
}

export async function updateUserWithRole(
  userInfo:
    | (UpdateUserSchema & { id: number })
    | (UpdateUserSchemaLegacy & { id: number; roleId: number }),
) {
  try {
    unstable_noStore();
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          name: userInfo.name,
          email: userInfo.email,
          username: userInfo.username || null,
          phoneNumber: userInfo.phoneNumber || null,
          departmentId: userInfo.departmentId || null,
          jobTitle: userInfo.jobTitle,
          isActive: userInfo.isActive,
        })
        .where(eq(users.id, userInfo.id));

      // Delete existing user roles
      await tx.delete(userRoles).where(eq(userRoles.userId, userInfo.id));

      // Handle multiple roles or single role (legacy)
      if ("roleIds" in userInfo && userInfo.roleIds) {
        // Multiple roles
        await tx.insert(userRoles).values(
          userInfo.roleIds.map((roleId) => ({
            userId: userInfo.id,
            roleId,
          })),
        );
      } else if ("roleId" in userInfo && userInfo.roleId) {
        // Single role (legacy support)
        await tx.insert(userRoles).values({
          userId: userInfo.id,
          roleId: userInfo.roleId,
        });
      }
    });

    revalidateTag("users");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error) || "Failed to update user",
    };
  }
}

export async function createUserWithRole(
  userInfo: UpdateUserSchema & { id: number; roleIds: number[] },
) {
  unstable_noStore();

  try {
    await db.transaction(async (tx) => {
      const createdUser = await auth.api.createUser({
        body: {
          email: userInfo.email,
          // Generate a random temp password — user must reset via email
          password: Math.random().toString(36).slice(-12) + "Aa1!",
          name: userInfo.name,
          role: "user",
          data: {
            phoneNumber: userInfo.phoneNumber,
            ...(userInfo.departmentId !== null && {
              departmentId: userInfo.departmentId,
            }),
            jobTitle: userInfo.jobTitle,
            isActive: true,
            username: userInfo.username,
          },
        },
      });

      const userId = Number(createdUser.user.id);

      for (const roleId of userInfo.roleIds) {
        await tx.insert(userRoles).values({
          userId,
          roleId: roleId,
        });
      }
    });

    revalidateTag("users");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("createUser error:", { error });
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteUsers(inputs: { ids: number[] }) {
  unstable_noStore();

  const userIds = inputs.ids;
  if (userIds.length === 0) {
    return { data: null, error: null };
  }

  try {
    await db.transaction(async (tx) => {
      await tx.delete(userRoles).where(inArray(userRoles.userId, userIds));
      await tx.delete(accounts).where(inArray(accounts.userId, userIds));
      await tx.delete(users).where(inArray(users.id, userIds));
    });

    revalidateTag("users");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    console.error("deleteUsers error:", err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export const getDepartments = async () => {
  const departments = await db.query.departments.findMany({
    orderBy: (departments, { asc }) => [asc(departments.name)],
  });

  return departments;
};

export const getUserAccounts = async (userId: number) => {
  unstable_noStore();
  try {
    const userAccounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId))
      .orderBy(asc(accounts.createdAt));

    return {
      success: true,
      data: userAccounts,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: getErrorMessage(error),
    };
  }
};

export const createUserAccount = async (input: {
  userId: number;
  password: string;
}) => {
  unstable_noStore();
  try {
    const ctx = await auth.$context;
    const hashedPassword = await ctx.password.hash(input.password);

    const existingAccount = await db.query.accounts.findFirst({
      where: (account, { eq, and }) =>
        and(
          eq(account.userId, input.userId),
          eq(account.providerId, "credential"),
        ),
    });

    if (existingAccount) {
      return {
        success: false,
        error: "Account already exists for this user",
      };
    }

    const created = await db
      .insert(accounts)
      .values({
        userId: input.userId,
        accountId: input.userId.toString(),
        providerId: "credential",
        password: hashedPassword,
      })
      .returning();

    revalidateTag("users");

    return {
      success: true,
      data: created[0],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};
