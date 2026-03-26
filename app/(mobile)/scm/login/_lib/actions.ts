"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { handleApiRequest } from "@/scripts/helper";
import type { User } from "@/db/schema";
import { auth } from "@/lib/auth";

export type Employee = Pick<
  User,
  "id" | "name" | "departmentId" | "branchId" | "employeeId"
>;

export async function login({ employeeId }: { employeeId: string }) {
  return handleApiRequest(async () => {
    const session = await auth.api.signInUsername({
      body: {
        username: employeeId,
        password: process.env.MOBILE_DEFAULT_PASSWORD ?? "changeme",
      },
    });

    if (!session?.token) {
      return null;
    }

    const employee = await db.query.users.findFirst({
      where: and(
        eq(users.employeeId, employeeId),
        or(
          eq(users.departmentId, 4),
          eq(users.jobTitle, "Inventory Control Executive"),
          eq(users.jobTitle, "Inventory Assistant"),
        ),
      ),
      columns: {
        id: true,
        name: true,
        departmentId: true,
        branchId: true,
        employeeId: true,
        username: true,
      },
    });

    return employee ? [employee] : [];
  });
}
