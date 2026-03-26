"use server";

import { db } from "@/db";
import { roles, userRoles } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function registerUser(input: FormData) {
  try {
    const response = await auth.api.signUpEmail({
      body: {
        email: input.get("email") as string,
        password: input.get("password") as string,
        username: input.get("username") as string,
        name: input.get("username") as string,
        phoneNumber: input.get("phoneNumber") as string,
      },
    });

    if (!response.user) {
      return { error: "Failed to register" };
    }

    switch (input.get("role") as string) {
      case "florist":
        const floristRole = await db.query.roles.findFirst({
          where: eq(roles.key, "florist"),
        });

        if (!floristRole) {
          throw new Error("Role not found");
        }

        await db.insert(userRoles).values({
          userId: Number(response.user.id),
          roleId: floristRole.id,
        });
        break;
      case "scm":
        const scmRole = await db.query.roles.findFirst({
          where: eq(roles.key, "scm"),
        });

        if (!scmRole) {
          throw new Error("Role not found");
        }

        await db.insert(userRoles).values({
          userId: Number(response.user.id),
          roleId: scmRole.id,
        });
      default:
        break;
    }
  } catch (e: any) {
    console.log(e);
    return { error: e.message };
  }
}
