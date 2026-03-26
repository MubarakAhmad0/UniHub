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
  ChevronRight,
  Cog,
  Flower2,
  HandCoins,
  Sprout,
  Users2,
} from "lucide-react";
import Link from "next/link";

const navProductionItems = [
  {
    title: "Production Inventory",
    url: "#",
    icon: Sprout,
    isActive: false,
    items: [
      {
        title: "Order Preparation",
        url: "/dashboard/production/order-prep",
      },
      {
        title: "Stock Transfer",
        url: "/dashboard/production/stock-transfers",
      },
      {
        title: "Sales Invoice Tracking",
        url: "/dashboard/production/sales-invoice-tracking",
      },
      {
        title: "Assembly Order Tracking",
        url: "/dashboard/production/assembly-order-tracking",
      },
    ],
  },
  {
    title: "WIP Production",
    url: "#",
    icon: Users2,
    isActive: false,
    items: [
      {
        title: "WIP Production List",
        url: "/dashboard/production/wip-production",
      },
      {
        title: "WIP Order Tracking",
        url: "/dashboard/production/wip-ao-tracking",
      },
    ],
  },
  // {
  //   title: "Virtual Order",
  //   url: "#",
  //   icon: ShoppingBasket,
  //   isActive: true,
  //   items: [
  //     {
  //       title: "Main",
  //       url: "/dashboard/production/virtual-order/main",
  //     },
  //     {
  //       title: "List Virtual Orders",
  //       url: "/dashboard/production/virtual-order/list",
  //     },
  //     {
  //       title: "Create Virtual Order",
  //       url: "/dashboard/production/virtual-order",
  //     },
  //   ],
  // },
  {
    title: "Line Items",
    url: "#",
    icon: Cog,
    isActive: false,
    items: [
      {
        title: "List of line items",
        url: "/dashboard/production/line-items",
      },
    ],
  },
  {
    title: "Recipes",
    url: "#",
    icon: Flower2,
    isActive: false,
    items: [
      {
        title: "List of Recipes",
        url: "/dashboard/products/recipes",
      },
    ],
  },
  {
    title: "Florists",
    url: "#",
    icon: Users2,
    isActive: false,
    items: [
      {
        title: "Curation Dashboard",
        url: "/production-curation-kanban",
      },
      {
        title: "Florist Leaderboard",
        url: "/dashboard/production/florist-leaderboard",
      },
      {
        title: "Florist Profile",
        url: "/dashboard/production/florist-metadata",
      },
    ],
  },
  {
    title: "Grab Mart Orders",
    url: "#",
    icon: HandCoins,
    isActive: false,
    items: [
      {
        title: "List Grab Mart Orders",
        url: "/dashboard/production/offline-orders",
      },
      {
        title: "Create Grab Mart Order",
        url: "/dashboard/production/offline-orders/create",
      },
    ],
  },
];

export function NavProduction() {
  const { handleOpenChange, isItemOpen } = useNavOpenItems(
    "production",
    navProductionItems,
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Production</SidebarGroupLabel>
      <SidebarMenu>
        {navProductionItems.map((item) => (
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
