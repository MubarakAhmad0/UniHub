import "server-only";

import { db } from "@/db";
import {
  permissions,
  roles,
  rolesToPermissions,
  userRoles,
} from "@/db/schema/auth";
import { unstable_cache } from "@/lib/unstable-cache";
import { eq } from "drizzle-orm";

export interface UserPermissions {
  roles: string[];
  permissions: string[];
  lastUpdated: number;
}

export async function getUserPermissionsWithCache(
  userId: string,
): Promise<UserPermissions> {
  return await unstable_cache(
    async () => {
      // Get user roles
      const userRoleData = await db
        .select({ roleKey: roles.key, roleName: roles.name })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(userRoles.userId, parseInt(userId)));

      const roleKeys = userRoleData.map((r) => r.roleKey);

      // Get permissions for these roles
      const permissionData =
        roleKeys.length > 0
          ? await db
              .select({
                resource: permissions.resource,
                action: permissions.action,
              })
              .from(userRoles)
              .innerJoin(
                rolesToPermissions,
                eq(userRoles.roleId, rolesToPermissions.roleId),
              )
              .innerJoin(
                permissions,
                eq(rolesToPermissions.permissionId, permissions.id),
              )
              .where(eq(userRoles.userId, parseInt(userId)))
          : [];

      const permissionStrings = permissionData.map(
        (p) => `${p.resource}:${p.action}`,
      );

      return {
        roles: roleKeys,
        permissions: permissionStrings,
        lastUpdated: Date.now(),
      };
    },
    [`user-permissions-${userId}`],
    {
      revalidate: 300, // 5 minutes
      tags: [`user-${userId}`, "permissions", "roles"],
    },
  )();
}

export async function invalidateUserPermissions(userId?: string) {
  const { revalidateTag } = await import("next/cache");

  if (userId) {
    revalidateTag(`user-${userId}`);
  } else {
    revalidateTag("permissions");
    revalidateTag("roles");
  }
}

export async function hasPermissionCached(
  userId: string,
  permission: string,
): Promise<boolean> {
  const userPerms = await getUserPermissionsWithCache(userId);
  return (
    userPerms.permissions.includes(permission) ||
    userPerms.roles.includes("admin")
  );
}

export async function hasRoleCached(
  userId: string,
  role: string,
): Promise<boolean> {
  const userPerms = await getUserPermissionsWithCache(userId);
  return userPerms.roles.includes(role) || userPerms.roles.includes("admin");
}

export async function hasAnyRoleCached(
  userId: string,
  roles: string[],
): Promise<boolean> {
  const userPerms = await getUserPermissionsWithCache(userId);
  return (
    userPerms.roles.some((role) => roles.includes(role)) ||
    userPerms.roles.includes("admin")
  );
}

export async function userDataCached(userId: number) {
  return unstable_cache(async () => {
    try {
      const userData = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
        with: {
          department: true,
        },
      });

      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [`user-data-${userId}`])();
}
