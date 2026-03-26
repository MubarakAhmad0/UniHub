/**
 * Internal users module — populate this with your own app's user data or 
 * replace with database-driven user lookups.
 */

export interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  location: string;
  email: string;
}

// Replace this with your own app's user groups
export const userGroups: Record<string, User[]> = {};

export const getUserByEmail = (email: string): User | undefined => {
  const departments = Object.values(userGroups);
  return departments
    .flat()
    .find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const getUserById = (id: string): User | undefined => {
  const departments = Object.values(userGroups);
  return departments.flat().find((user) => user.id === id);
};
