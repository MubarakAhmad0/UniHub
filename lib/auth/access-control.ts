export type Resource = string;
export type Action = string;

export const resources: Resource[] = [
  "logistics",
  "sales",
  "marketing",
  "finance",
  "hr",
  "admin",
  "florist",
  "customer-service",
  "driver",
  "retail",
  "production",
  "ceo-office",
  "brand",
];
export const actions: Action[] = [
  "create",
  "read",
  "update",
  "delete",
  "approve",
  "reject",
];

export type PermissionString = `${Resource}:${Action}`;
