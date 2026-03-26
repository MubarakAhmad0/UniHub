// app/hooks/useAuth.ts
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSession } from "./auth-client";
import { getUserPermissions, getUserRoles as getUserRolesUtils } from "./utils";

type AuthHookOptions = {
  debug?: boolean;
};

export function useAuth(options: AuthHookOptions = {}) {
  const { data: session, error, isPending } = useSession();

  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const user = session?.user ?? null;
  const isAuthenticated = !!user;
  const isLoading = isPending || !isLoaded;

  const debugLog = (label: string, value: any) => {
    if (options.debug) console.log(`[useAuth] ${label}:`, value);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      try {
        const [p, r] = await Promise.all([
          getUserPermissions(),
          getUserRolesUtils(),
        ]);
        setPermissions(p);
        setRoles(r);
      } catch (err) {
        console.error("Failed to load auth roles/permissions:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    load();
  }, [isAuthenticated]);

  const hasPermission = useCallback(
    (perm: string): boolean => {
      const result = permissions.includes(perm) || roles.includes("admin");
      debugLog(`hasPermission(${perm})`, result);
      return result;
    },
    [permissions, roles, debugLog],
  );

  const hasAnyPermission = useCallback(
    (perms: string[]) => {
      const result = perms.some(hasPermission);
      debugLog(`hasAnyPermission(${perms.join(",")})`, result);
      return result;
    },
    [hasPermission, debugLog],
  );

  const hasAllPermissions = useCallback(
    (perms: string[]) => {
      const result = perms.every(hasPermission);
      debugLog(`hasAllPermissions(${perms.join(",")})`, result);
      return result;
    },
    [hasPermission, debugLog],
  );

  const hasRole = useCallback(
    (role: string) => {
      const result = roles.includes(role);
      debugLog(`hasRole(${role})`, result);
      return result;
    },
    [roles, debugLog],
  );

  const hasAnyRole = useCallback(
    (targetRoles: string[]) => {
      const result = targetRoles.some((r) => roles.includes(r));
      debugLog(`hasAnyRole(${targetRoles.join(",")})`, result);
      return result;
    },
    [roles, debugLog],
  );

  const can = useMemo(() => {
    return {
      create: (r: string) => hasPermission(`${r}:create`),
      read: (r: string) => hasPermission(`${r}:read`),
      update: (r: string) => hasPermission(`${r}:update`),
      delete: (r: string) => hasPermission(`${r}:delete`),
      approve: (r: string) => hasPermission(`${r}:approve`),
      reject: (r: string) => hasPermission(`${r}:reject`),
    };
  }, [hasPermission]);

  return {
    isAuthenticated,
    isLoading,
    error,
    user,
    roles,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    can,
  };
}
