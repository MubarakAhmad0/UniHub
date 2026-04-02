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
  Building2,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LibraryBig,
  MapPin,
  MessageSquare,
  PackageSearch,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navCampusItems = [
  {
    title: "Campus",
    url: "#",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Timetable",
        href: "/dashboard/campus/timetable",
        icon: CalendarDays,
      },
      {
        title: "Campus Map",
        href: "/dashboard/campus/map",
        icon: MapPin,
      },
      {
        title: "Library Booking",
        href: "/dashboard/campus/library",
        icon: LibraryBig,
      },
      {
        title: "Venue & Facilities",
        href: "/dashboard/campus/venues",
        icon: Trophy,
      },
      {
        title: "Campus Events",
        href: "/dashboard/campus/events",
        icon: Building2,
      },
      {
        title: "Lost & Found",
        href: "/dashboard/campus/lost-found",
        icon: PackageSearch,
      },
      {
        title: "Community Forums",
        href: "/dashboard/campus/forums",
        icon: MessageSquare,
      },
    ],
  },
];

export function NavCampus() {
  const pathname = usePathname();
  const { isItemOpen, handleOpenChange } = useNavOpenItems(
    "campus",
    navCampusItems,
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Campus</SidebarGroupLabel>
      <SidebarMenu>
        {navCampusItems.map((section) => (
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
                        isActive={pathname.startsWith(item.href)}
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
