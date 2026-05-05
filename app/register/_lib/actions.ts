"use server";

import { db } from "@/db";
import { roles, userRoles } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function registerUser(input: FormData) {
  try {
    const roleKey = input.get("role") as string;

    // Build the signup payload. Only include phoneNumber if provided to avoid
    // triggering unique constraint violations on existing numbers.
    const email = input.get("email") as string;
    const password = input.get("password") as string;
    const username = input.get("username") as string;
    const name = input.get("username") as string;
    const rawPhone = input.get("phoneNumber") as string | null | undefined;
    const phoneTrimmed = rawPhone?.trim();

    const body: any = {
      email,
      password,
      username,
      name,
    };
    if (phoneTrimmed) {
      body.phoneNumber = phoneTrimmed;
    }

    const response = await auth.api.signUpEmail({
      body,
    });

    if (!response.user) {
      return { error: "Failed to register" };
    }

    // Assign role based on selection
    const role = await db.query.roles.findFirst({
      where: eq(roles.key, roleKey),
    });

    if (role) {
      await db.insert(userRoles).values({
        userId: Number(response.user.id),
        roleId: role.id,
      });
    }

    return { success: true };
  } catch (e: any) {
    console.log(e);
    return { error: e.message || "Registration failed" };
  }
}
