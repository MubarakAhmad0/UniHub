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
import { ChevronRight, HandCoins } from "lucide-react";
import Link from "next/link";

const navSalesItems = [
  {
    title: "Offline Order",
    url: "#",
    icon: HandCoins,
    isActive: false,
    items: [
      {
        title: "List Offline Order",
        url: "/dashboard/sales/offline-orders",
      },
      {
        title: "Create Offline Order",
        url: "/dashboard/sales/offline-orders/create",
      },
    ],
  },
];

export function NavSales() {
  const { handleOpenChange, isItemOpen } = useNavOpenItems(
    "sales",
    navSalesItems,
  );
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Sales</SidebarGroupLabel>
      <SidebarMenu>
        {navSalesItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            className="group/collapsible"
            open={isItemOpen(item.title)}
            onOpenChange={(isOpen) => handleOpenChange(item.title, isOpen)}
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
