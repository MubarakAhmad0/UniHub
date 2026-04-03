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
import { ChevronRight, LayoutDashboard, Megaphone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navGeneralItems = [
  {
    title: "General",
    url: "#",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
      },
    ],
  },
];

export function NavGeneral() {
  const pathname = usePathname();
  const { isItemOpen, handleOpenChange } = useNavOpenItems(
    "general",
    navGeneralItems,
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {navGeneralItems.map((section) => (
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
