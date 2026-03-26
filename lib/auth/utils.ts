"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getUserPermissionsWithCache,
  hasAnyRoleCached,
  hasPermissionCached,
  hasRoleCached,
  userDataCached,
} from "./permission-cache";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getUserData() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return await userDataCached(parseInt(userId));
}

export async function getCurrentUserId() {
  const session = await getSession();
  return session?.user?.id || null;
}

export async function hasAnyRole(roles: string[]) {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  return await hasAnyRoleCached(userId, roles);
}

export async function hasRole(role: string) {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  return await hasRoleCached(userId, role);
}

/**
 * Check if current user has specific permission (with caching)
 */
export async function hasPermission(permission: string) {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  return await hasPermissionCached(userId, permission);
}

export async function hasAnyPermission(permissions: string[]) {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const userPerms = await getUserPermissionsWithCache(userId);
  return permissions.some(
    (perm) =>
      userPerms.permissions.includes(perm) || userPerms.roles.includes("admin"),
  );
}

export async function getUserRoles(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const userPerms = await getUserPermissionsWithCache(userId);
  return userPerms.roles;
}

export async function getUserPermissions(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const userPerms = await getUserPermissionsWithCache(userId);
  return userPerms.permissions;
}

export async function getUserAuthData() {
  const userId = await getCurrentUserId();
  if (!userId) return { roles: [], permissions: [], isAuthenticated: false };

  const userPerms = await getUserPermissionsWithCache(userId);
  return {
    ...userPerms,
    isAuthenticated: true,
    userId,
  };
}

export async function checkPermissions(
  permissions: string[],
  logic: "AND" | "OR" = "OR",
): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const userPerms = await getUserPermissionsWithCache(userId);

  // Admin bypass
  if (userPerms.roles.includes("admin")) return true;

  if (logic === "AND") {
    return permissions.every((perm) => userPerms.permissions.includes(perm));
  } else {
    return permissions.some((perm) => userPerms.permissions.includes(perm));
  }
}

/**
 * Resource-specific permission helpers
 */
export async function canCreate(resource: string): Promise<boolean> {
  return await hasPermission(`${resource}:create`);
}

export async function canRead(resource: string): Promise<boolean> {
  return await hasPermission(`${resource}:read`);
}

export async function canUpdate(resource: string): Promise<boolean> {
  return await hasPermission(`${resource}:update`);
}

export async function canDelete(resource: string): Promise<boolean> {
  return await hasPermission(`${resource}:delete`);
}

export async function canApprove(resource: string): Promise<boolean> {
  return await hasPermission(`${resource}:approve`);
}

export async function canReject(resource: string): Promise<boolean> {
  return await hasPermission(`${resource}:reject`);
}
