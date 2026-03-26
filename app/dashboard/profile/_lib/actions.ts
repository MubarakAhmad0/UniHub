"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { accounts } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import type { ProfileUpdateData, PasswordChangeData } from "./validations";

export async function updateProfile(data: ProfileUpdateData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    await db
      .update(users)
      .set({
        name: data.name,
        email: data.email,
      })
      .where(eq(users.id, Number(session.user.id)));

    revalidateTag("profile");

    return { success: true, error: null };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function changePassword(data: PasswordChangeData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const ctx = await auth.$context;
    const userId = Number(session.user.id);

    // Find existing account
    const existingAccount = await db.query.accounts.findFirst({
      where: eq(accounts.userId, userId),
    });

    if (existingAccount && existingAccount.password) {
      // Verify current password
      const isValidPassword = await ctx.password.verify({
        password: data.currentPassword,
        hash: existingAccount.password,
      });

      if (!isValidPassword) {
        return { success: false, error: "Current password is incorrect" };
      }
    }

    // Hash new password
    const hashedPassword = await ctx.password.hash(data.newPassword);

    if (existingAccount) {
      // Update existing password
      await db
        .update(accounts)
        .set({ password: hashedPassword })
        .where(eq(accounts.userId, userId));
    } else {
      // Create new account with password
      await db.insert(accounts).values({
        accountId: userId.toString(),
        userId,
        providerId: "credential",
        password: hashedPassword,
      });
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Password change error:", error);
    return { success: false, error: "Failed to change password" };
  }
}

export async function sendPasswordResetEmail() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !session.user.email) {
      return { success: false, error: "Not authenticated or no email found" };
    }

    // Use better-auth's built-in reset password functionality
    await auth.api.forgetPassword({
      body: {
        email: session.user.email,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
      },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Password reset email error:", error);
    return { success: false, error: "Failed to send reset email" };
  }
}
