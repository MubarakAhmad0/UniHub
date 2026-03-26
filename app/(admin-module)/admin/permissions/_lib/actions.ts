"use server";

import { db } from "@/db";
import {
  NewPermission,
  permissions,
  rolesToPermissions,
} from "@/db/schema/auth";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPermissions() {
  const result = await db
    .select({
      id: permissions.id,
      resource: permissions.resource,
      action: permissions.action,
      description: permissions.description,
      roleCount: sql<number>`count(${rolesToPermissions.roleId})`.mapWith(
        Number,
      ),
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
    .from(permissions)
    .leftJoin(
      rolesToPermissions,
      eq(permissions.id, rolesToPermissions.permissionId),
    )
    .groupBy(
      permissions.id,
      permissions.action,
      permissions.resource,
      permissions.description,
    )
    .orderBy(permissions.resource, permissions.action);

  return result;
}

export async function getPermissionWithRoles(permissionId: number) {
  const permission = await db.query.permissions.findFirst({
    where: eq(permissions.id, permissionId),
    with: {
      rolesToPermissions: {
        with: {
          role: true,
        },
      },
    },
  });

  if (!permission) return null;

  return {
    id: permission.id,
    action: permission.action,
    resource: permission.resource,
    description: permission.description,
    roles: permission.rolesToPermissions
      .map((rtp) => rtp.role)
      .filter(Boolean) as {
      id: number;
      key: string;
      description: string | null;
    }[],
  };
}

export async function createPermission(data: NewPermission) {
  try {
    const [newPermission] = await db
      .insert(permissions)
      .values({
        description: data.description || null,
        action: data.action,
        resource: data.resource,
      })
      .returning();

    revalidatePath("/admin/permissions");
    return { success: true, permission: newPermission };
  } catch (error) {
    console.error("Error creating permission:", error);
    return { success: false, error: "Failed to create permission" };
  }
}

export async function updatePermission(
  permissionId: number,
  data: NewPermission,
) {
  try {
    const [updatedPermission] = await db
      .update(permissions)
      .set({
        description: data.description || null,
        action: data.action,
        resource: data.resource,
      })
      .where(eq(permissions.id, permissionId))
      .returning();

    revalidatePath("/admin/permissions");
    return { success: true, permission: updatedPermission };
  } catch (error) {
    console.error("Error updating permission:", error);
    return { success: false, error: "Failed to update permission" };
  }
}

export async function deletePermission(permissionId: number) {
  try {
    // First delete all role-permission associations
    await db
      .delete(rolesToPermissions)
      .where(eq(rolesToPermissions.permissionId, permissionId));

    // Then delete the permission
    await db.delete(permissions).where(eq(permissions.id, permissionId));

    revalidatePath("/admin/permissions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting permission:", error);
    return { success: false, error: "Failed to delete permission" };
  }
}

export async function assignRolesToPermission(
  permissionId: number,
  roleIds: number[],
) {
  try {
    // First remove all existing roles for this permission
    await db
      .delete(rolesToPermissions)
      .where(eq(rolesToPermissions.permissionId, permissionId));

    // Then add the new roles
    if (roleIds.length > 0) {
      await db.insert(rolesToPermissions).values(
        roleIds.map((roleId) => ({
          roleId,
          permissionId,
        })),
      );
    }

    revalidatePath("/admin/permissions");
    return { success: true };
  } catch (error) {
    console.error("Error assigning roles to permission:", error);
    return { success: false, error: "Failed to assign roles" };
  }
}
