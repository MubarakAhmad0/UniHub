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
import { ChevronRight, HandCoins, ShoppingBag } from "lucide-react";
import Link from "next/link";

const navRetailItems = [
  {
    title: "Retail Stock Transfer",
    url: "#",
    icon: HandCoins,
    isActive: false,
    items: [
      {
        title: "List Retail Stock Transfer",
        url: "/dashboard/retail/offline-orders",
      },
      {
        title: "Create Retail Stock Transfer",
        url: "/dashboard/retail/offline-orders/create",
      },
    ],
  },
  {
    title: "Self Pickup",
    url: "#",
    icon: ShoppingBag,
    isActive: false,
    items: [
      {
        title: "List Self Pickup",
        url: "/dashboard/retail/self-pickup",
      },
    ],
  },
];

export function NavRetail() {
  const { handleOpenChange, isItemOpen } = useNavOpenItems(
    "retail",
    navRetailItems,
  );
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Retail</SidebarGroupLabel>
      <SidebarMenu>
        {navRetailItems.map((item) => (
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
