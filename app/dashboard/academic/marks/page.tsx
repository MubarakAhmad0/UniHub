"use client";

import { useAuth } from "@/lib/auth/use-auth";
import { AdminMarksView } from "./_components/admin-view";
import { ManagerMarksView } from "./_components/manager-view";
import { StudentMarksView } from "./_components/student-view";

export default function MarksPage() {
  const { hasRole } = useAuth();

  if (hasRole("admin")) return <AdminMarksView />;
  if (hasRole("manager")) return <ManagerMarksView />;
  return <StudentMarksView />;
}
