import { getUserRoles } from "./utils";

// Define sidebar sections
export type SidebarSection =
  | "admin";

// Map of role keys to sidebar section access
const SIDEBAR_PERMISSIONS: Record<
  string,
  Partial<Record<SidebarSection, boolean>>
> = {
  // Admin can see everything
  admin: {
    admin: true,
  },
};

/**
 * Check if user has access to a specific sidebar section
 */
export async function canAccessSidebarSection(
  section: SidebarSection,
): Promise<boolean> {
  const userRoles = await getUserRoles();

  // Admin can access everything
  if (userRoles.includes("admin")) {
    return true;
  }

  // Check if any of user's roles grant access to this section
  return userRoles.some((role) => {
    const rolePermissions = SIDEBAR_PERMISSIONS[role];
    return rolePermissions?.[section] === true;
  });
}

/**
 * Get all sidebar sections that user can access
 */
export async function getAccessibleSidebarSections(): Promise<
  SidebarSection[]
> {
  const userRoles = await getUserRoles();
  const accessibleSections: Set<SidebarSection> = new Set();

  // Admin can access everything
  if (userRoles.includes("admin")) {
    return [
      "admin",
    ];
  }

  // Aggregate permissions from all user roles
  userRoles.forEach((role) => {
    const rolePermissions = SIDEBAR_PERMISSIONS[role];
    if (rolePermissions) {
      Object.entries(rolePermissions).forEach(([section, hasAccess]) => {
        if (hasAccess) {
          accessibleSections.add(section as SidebarSection);
        }
      });
    }
  });

  return Array.from(accessibleSections);
}

/**
 * Check if user has any role-based access (not just admin)
 */
export async function hasAnyRoleAccess(): Promise<boolean> {
  const userRoles = await getUserRoles();
  return userRoles.some((role) => role in SIDEBAR_PERMISSIONS);
}
