"use server";

import { db } from "@/db";
import { roles, rolesToPermissions, NewRole } from "@/db/schema/auth";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getRoles() {
  const result = await db
    .select({
      id: roles.id,
      name: roles.name,
      description: roles.description,
      key: roles.key,
      permissionCount:
        sql<number>`count(${rolesToPermissions.permissionId})`.mapWith(Number),
      createdAt: roles.createdAt,
      updatedAt: roles.updatedAt,
    })
    .from(roles)
    .leftJoin(rolesToPermissions, eq(roles.id, rolesToPermissions.roleId))
    .groupBy(roles.id, roles.description, roles.key)
    .orderBy(roles.key);

  return result;
}

export async function getRoleWithPermissions(roleId: number) {
  const role = await db.query.roles.findFirst({
    where: eq(roles.id, roleId),
    with: {
      rolesToPermissions: {
        with: {
          permission: true,
        },
      },
    },
  });

  if (!role) return null;

  return {
    id: role.id,
    key: role.key,
    description: role.description,
    permissions: role.rolesToPermissions.map((rtp) => rtp.permission),
  };
}

export async function createRole(data: NewRole) {
  try {
    const [newRole] = await db
      .insert(roles)
      .values({
        name: data.name,
        description: data.description,
        key: data.key,
      })
      .returning();

    revalidatePath("/admin/roles");
    return { success: true, role: newRole };
  } catch (error) {
    console.error("Error creating role:", error);
    return { success: false, error: "Failed to create role" };
  }
}

export async function updateRole(roleId: number, data: NewRole) {
  try {
    const [updatedRole] = await db
      .update(roles)
      .set({
        key: data.key,
        description: data.description || null,
      })
      .where(eq(roles.id, roleId))
      .returning();

    revalidatePath("/admin/roles");
    return { success: true, role: updatedRole };
  } catch (error) {
    console.error("Error updating role:", error);
    return { success: false, error: "Failed to update role" };
  }
}

export async function deleteRole(roleId: number) {
  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(rolesToPermissions)
        .where(eq(rolesToPermissions.roleId, roleId));
      await tx.delete(roles).where(eq(roles.id, roleId));
    });

    revalidatePath("/admin/roles");

    return { success: true };
  } catch (error) {
    console.error("Error deleting role:", error);
    return { success: false, error: "Failed to delete role" };
  }
}

export async function assignPermissionsToRole(
  roleId: number,
  permissionIds: number[],
) {
  try {
    await db
      .delete(rolesToPermissions)
      .where(eq(rolesToPermissions.roleId, roleId));

    if (permissionIds.length > 0) {
      await db.insert(rolesToPermissions).values(
        permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      );
    }

    revalidatePath("/admin/roles");
    return { success: true };
  } catch (error) {
    console.error("Error assigning permissions to role:", error);
    return { success: false, error: "Failed to assign permissions" };
  }
}
