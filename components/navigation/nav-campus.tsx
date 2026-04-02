"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Building2,
  CalendarDays,
  LibraryBig,
  MapPin,
  MessageSquare,
  PackageSearch,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const campusNav = [
  {
    label: "Timetable",
    href: "/dashboard/campus/timetable",
    icon: CalendarDays,
  },
  { label: "Campus Map", href: "/dashboard/campus/map", icon: MapPin },
  {
    label: "Library Booking",
    href: "/dashboard/campus/library",
    icon: LibraryBig,
  },
  {
    label: "Venue & Facilities",
    href: "/dashboard/campus/venues",
    icon: Trophy,
  },
  { label: "Campus Events", href: "/dashboard/campus/events", icon: Building2 },
  {
    label: "Lost & Found",
    href: "/dashboard/campus/lost-found",
    icon: PackageSearch,
  },
  {
    label: "Community Forums",
    href: "/dashboard/campus/forums",
    icon: MessageSquare,
  },
];

export function NavCampus() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Campus</SidebarGroupLabel>
      <SidebarMenu>
        {campusNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
            >
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
