"use server";

import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from ".";
import { users } from "./schema";

export async function getCurrentUserFromDb() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.session) {
    throw new Error("Session not found");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const role = await db.query.userRoles.findFirst({
    where: (userRoles, { eq }) => eq(userRoles.userId, user.id),
    with: {
      role: true,
    },
  });

  return {
    ...user,
    newRole: role?.role?.key, // driver
  };
}
