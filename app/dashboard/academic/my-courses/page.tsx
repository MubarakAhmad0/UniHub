"use client";

import { useAuth } from "@/lib/auth/use-auth";
import { AdminAllCourses } from "./_components/admin-view";
import { ManagerMyCourses } from "./_components/manager-view";
import { StudentMyCourses } from "./_components/student-view";

export default function MyCoursesPage() {
  const { hasRole } = useAuth();

  if (hasRole("admin")) return <AdminAllCourses />;
  if (hasRole("manager")) return <ManagerMyCourses />;
  return <StudentMyCourses />;
}
