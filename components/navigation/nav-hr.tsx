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
import { ChevronRight, HandCoins, Hourglass, Users2 } from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "Users",
    url: "#",
    icon: Users2,
    isActive: false,
    items: [
      {
        title: "List of Users",
        url: "/dashboard/hr/users",
      },
    ],
  },
  {
    title: "Overtime",
    url: "#",
    icon: Hourglass,
    isActive: false,
    items: [
      {
        title: "List of Overtime",
        url: "/dashboard/hr/overtime",
      },
    ],
  },
  {
    title: "HR Product Requests",
    url: "#",
    icon: HandCoins,
    isActive: false,
    items: [
      {
        title: "List HR Product Requests",
        url: "/dashboard/hr/offline-orders",
      },
      {
        title: "Create HR Product Request",
        url: "/dashboard/hr/offline-orders/create",
      },
    ],
  },
];

export function NavHR() {
  const { handleOpenChange, isItemOpen } = useNavOpenItems("hr", items);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Human Resources</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={isItemOpen(item.title)}
            onOpenChange={(isOpen) => handleOpenChange(item.title, isOpen)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
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
