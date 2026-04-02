"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart2,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const academicNav = [
  {
    label: "Course Catalog",
    href: "/dashboard/academic/courses",
    icon: BookOpen,
  },
  {
    label: "My Courses",
    href: "/dashboard/academic/my-courses",
    icon: GraduationCap,
  },
  {
    label: "Announcements",
    href: "/dashboard/academic/announcements",
    icon: Megaphone,
  },
  {
    label: "Study Plan",
    href: "/dashboard/academic/study-plan",
    icon: CalendarDays,
  },
  {
    label: "Marks & GPA",
    href: "/dashboard/academic/marks",
    icon: BarChart2,
  },
  {
    label: "Attendance",
    href: "/dashboard/academic/attendance",
    icon: ClipboardCheck,
  },
];

export function NavAcademic() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Academic</SidebarGroupLabel>
      <SidebarMenu>
        {academicNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={pathname === item.href}>
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
