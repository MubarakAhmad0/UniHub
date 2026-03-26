"use client";

import { ChevronRight, List } from "lucide-react";

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
import { Presentation } from "lucide-react";
import Link from "next/link";

const navMarketingItems = [
  {
    title: "Orders",
    url: "#",
    icon: List,
    isActive: false,
    items: [
      {
        title: "List of Orders",
        url: "/dashboard/marketing/orders",
      },
    ],
  },
  {
    title: "Shipping Rates",
    url: "#",
    icon: Presentation,
    isActive: false,
    items: [
      {
        title: "All Shipping Rates",
        url: "/dashboard/marketing/shipping-rates",
      },
    ],
  },
];

export function NavMarketing() {
  const { handleOpenChange, isItemOpen } = useNavOpenItems(
    "marketing",
    navMarketingItems,
  );
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Marketing</SidebarGroupLabel>
      <SidebarMenu>
        {navMarketingItems.map((item) => (
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
