"use server";

import { db } from "@/db";
import { accounts } from "@/db/schema/auth";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidateTag, unstable_noStore } from "next/cache";
import { getErrorMessage } from "@/lib/handle-error";

export const getUsersForDropdown = async () => {
  try {
    const users = await db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
      orderBy: (users, { asc }) => [asc(users.name)],
    });

    return {
      success: true,
      data: users,
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

export const changeUserPassword = async (input: {
  userId: number;
  newPassword: string;
}) => {
  unstable_noStore();
  try {
    const ctx = await auth.$context;
    const hashedPassword = await ctx.password.hash(input.newPassword);

    const existing = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, input.userId),
    });

    if (!existing) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const existingAccount = await db.query.accounts.findFirst({
      where: (account, { eq }) => eq(account.userId, existing.id),
    });

    if (existingAccount) {
      const updated = await db
        .update(accounts)
        .set({
          password: hashedPassword,
        })
        .where(eq(accounts.userId, existing.id))
        .returning();

      revalidateTag("users");

      return {
        success: true,
        data: updated[0],
        error: null,
      };
    } else {
      const created = await db
        .insert(accounts)
        .values({
          accountId: existing.id.toString(),
          userId: existing.id,
          password: hashedPassword,
          providerId: "credentials",
        })
        .returning();

      revalidateTag("users");

      return {
        success: true,
        data: created[0],
        error: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};
