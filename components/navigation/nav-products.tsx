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
  BoxIcon,
  ChevronRight,
  Flower2,
  Package,
  Settings,
  SunSnowIcon,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

const navProductsItems = [
  {
    title: "Products",
    url: "#",
    icon: BoxIcon,
    isActive: false,
    items: [
      {
        title: "List of Products",
        url: "/dashboard/products/products",
      },
      {
        title: "List of Product Variants",
        url: "/dashboard/products/variants",
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
      {
        title: "Create Recipe",
        url: "/dashboard/products/recipes/create",
      },
    ],
  },
  {
    title: "Items",
    url: "#",
    icon: Package,
    isActive: false,
    items: [
      {
        title: "List of Items",
        url: "/dashboard/products/items",
      },
      {
        title: "Update Balance Logs",
        url: "/dashboard/products/items/update-balance-logs",
      },
    ],
  },
  {
    title: "Peak Season Forecasts",
    url: "#",
    icon: SunSnowIcon,
    isActive: false,
    items: [
      {
        title: "Peak Season Forecaster",
        url: "/dashboard/products/peak-season-forecasts",
      },
    ],
  },
  {
    title: "Item Management",
    url: "#",
    icon: Settings,
    isActive: false,
    items: [
      {
        title: "Overview",
        url: "/dashboard/products/item-management",
      },
      {
        title: "Raw Materials",
        url: "/dashboard/products/item-management/raw-materials",
      },
      {
        title: "Work in Progress",
        url: "/dashboard/products/item-management/wip",
      },
      {
        title: "Finished Goods",
        url: "/dashboard/products/item-management/finished-goods",
      },
      {
        title: "Resources",
        url: "/dashboard/products/item-management/resources",
      },
      {
        title: "BOM Validation",
        url: "/dashboard/products/item-management/bom-validation",
      },
      {
        title: "Label Printing",
        url: "/dashboard/products/item-management/po-label-printing",
      },
    ],
  },
  {
    title: "Stock Tracker",
    url: "#",
    icon: BarChart3,
    isActive: false,
    items: [
      {
        title: "Inventory View",
        url: "/dashboard/products/stock-tracker/stock-tracker",
      },
      {
        title: "Manage Products",
        url: "/dashboard/products/stock-tracker/stock-tracker-picker",
      },
    ],
  },
];

export function NavProducts() {
  const { handleOpenChange, isItemOpen } = useNavOpenItems(
    "products",
    navProductsItems,
  );
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Products</SidebarGroupLabel>
      <SidebarMenu>
        {navProductsItems.map((item) => (
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
