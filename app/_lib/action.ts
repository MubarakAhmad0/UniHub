"use server";
import { getUserPermissionsWithCache } from "@/lib/auth/permission-cache";

export async function getUserRolesNoCache(userId: string): Promise<string[]> {
  if (!userId) return [];

  const userPerms = await getUserPermissionsWithCache(userId);
  return userPerms.roles;
}
