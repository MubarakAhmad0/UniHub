"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useNavOpenItems } from "@/hooks/use-nav-open-items";
import {
  BarChart2,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  Megaphone,
  School,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navAcademicItems = [
  {
    title: "Academic",
    url: "#",
    icon: School,
    isActive: true,
    items: [
      {
        title: "Course Catalog",
        href: "/dashboard/academic/courses",
        icon: BookOpen,
      },
      {
        title: "My Courses",
        href: "/dashboard/academic/my-courses",
        icon: GraduationCap,
      },
      {
        title: "Announcements",
        href: "/dashboard/academic/announcements",
        icon: Megaphone,
      },
      {
        title: "Study Plan",
        href: "/dashboard/academic/study-plan",
        icon: CalendarDays,
      },
      {
        title: "Marks & GPA",
        href: "/dashboard/academic/marks",
        icon: BarChart2,
      },
      {
        title: "Attendance",
        href: "/dashboard/academic/attendance",
        icon: ClipboardCheck,
      },
    ],
  },
];

export function NavAcademic() {
  const pathname = usePathname();
  const { isItemOpen, handleOpenChange } = useNavOpenItems(
    "academic",
    navAcademicItems,
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Academic</SidebarGroupLabel>
      <SidebarMenu>
        {navAcademicItems.map((section) => (
          <Collapsible
            key={section.title}
            asChild
            open={isItemOpen(section.title)}
            onOpenChange={(isOpen) => handleOpenChange(section.title, isOpen)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={section.title}>
                  {section.icon && <section.icon />}
                  <span>{section.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {section.items?.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
