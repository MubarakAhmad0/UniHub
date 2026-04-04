"use client";

import { useAuth } from "@/lib/auth/use-auth";
import { AdminAttendanceView } from "./_components/admin-view";
import { ManagerAttendanceView } from "./_components/manager-view";
import { StudentAttendanceView } from "./_components/student-view";

export default function AttendancePage() {
  const { hasRole } = useAuth();

  if (hasRole("admin")) return <AdminAttendanceView />;
  if (hasRole("manager")) return <ManagerAttendanceView />;
  return <StudentAttendanceView />;
}
