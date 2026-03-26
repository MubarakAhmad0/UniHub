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
  Receipt,
  ScrollText,
} from "lucide-react";
import Link from "next/link";

const navSupplyChainManagementItems = [
  // {
  //     title: "Report",
  //     url: "#",
  //     icon: ScrollText,
  //     isActive: true,
  //     items: [
  //         {
  //             title: "Data (Usage) - Material",
  //             url: "/dashboard/scm/report/usage",
  //         },
  //         {
  //             title: "Data (Purchase) - Material",
  //             url: "/dashboard/scm/report/purchase",
  //         },
  //         {
  //             title: "Data (Transfer) - Material",
  //             url: "/dashboard/scm/report/transfer",
  //         },
  //         {
  //             title: "Data (Goods Received)",
  //             url: "/dashboard/scm/report/goods-received",
  //         },
  //         {
  //             title: "Data (Wastage) - Material",
  //             url: "/dashboard/scm/report/wastage",
  //         },
  //         {
  //             title: "Data (Stock Check)",
  //             url: "/dashboard/scm/report/stock-check",
  //         },
  //     ],
  // },
  {
    title: "Online Orders",
    url: "#",
    icon: Receipt,
    isActive: false,
    items: [
      {
        title: "Orders",
        url: "/dashboard/cs/orders",
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
    title: "Procurement",
    url: "#",
    icon: ScrollText,
    isActive: false,
    items: [
      {
        title: "Online Orders",
        url: "/dashboard/scm/procurement/online-orders",
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
];

const NavSCM = () => {
  const { handleOpenChange, isItemOpen } = useNavOpenItems(
    "supply-chain-management",
    navSupplyChainManagementItems,
  );
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Supply Chain Management</SidebarGroupLabel>
      <SidebarMenu>
        {navSupplyChainManagementItems.map((item) => (
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
};

export default NavSCM;
