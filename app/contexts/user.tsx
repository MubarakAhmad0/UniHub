/**
 * User State Management
 *
 * This context provides a hybrid approach for managing user state:
 * - Client-side: Uses Context + localStorage for fast access
 * - Server-side: Uses cookies for server components/actions
 *
 * Usage:
 * 1. Client Components:
 *    const { user } = useUser();
 *
 * 2. Server Components/Actions:
 *    const storedUser = cookies().get("user")?.value;
 *    const user = JSON.parse(storedUser);
 */
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@/db/schema";

type StoredUser = Pick<
  User,
  "id" | "name" | "employeeId" | "departmentId" | "branchId"
>;

interface UserContextType {
  user: StoredUser | null;
  setUser: (user: StoredUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const handleSetUser = (newUser: StoredUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
