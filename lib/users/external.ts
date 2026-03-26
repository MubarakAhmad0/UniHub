/**
 * External users module — populate this with your own app's external/contractor user data,
 * or remove this file entirely if not needed.
 */

export interface ExternalUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

// Replace this with your own app's external user groups
export const externalUserGroups: Record<string, ExternalUser[]> = {};
