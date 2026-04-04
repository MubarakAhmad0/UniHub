"use client";

import { useAuth } from "@/lib/auth/use-auth";
import { AdminTimetableView } from "./_components/admin-view";
import { ManagerTimetableView } from "./_components/manager-view";
import { StudentTimetableView } from "./_components/student-view";

export default function TimetablePage() {
  const { hasRole } = useAuth();

  if (hasRole("admin")) return <AdminTimetableView />;
  if (hasRole("manager")) return <ManagerTimetableView />;
  return <StudentTimetableView />;
}
