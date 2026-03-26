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
import { ChevronRight, Settings, Truck } from "lucide-react";
import Link from "next/link";

const navLogisticItems = [
  {
    title: "Delivery",
    url: "/dashboard/logistic/delivery",
    icon: Truck,
    isActive: false,
    items: [
      {
        title: "Routing",
        url: "/dashboard/logistic/delivery/routing",
      },
      {
        title: "Delivery Groups",
        url: "/dashboard/logistic/delivery/groups",
      },

      {
        title: "Claims",
        url: "/dashboard/logistic/delivery/claims",
      },
      {
        title: "Invalid Addresses",
        url: "/dashboard/logistic/delivery/invalid-address",
      },
    ],
  },
  {
    title: "Manage",
    url: "/dashboard/logistic/manage",
    icon: Settings,
    isActive: false,
    items: [
      {
        title: "Drivers",
        url: "/dashboard/logistic/manage/drivers",
      },
      {
        title: "Driver Groups",
        url: "/dashboard/logistic/manage/drivers/driver-groups",
      },
      {
        title: "Reports",
        url: "/dashboard/logistic/manage/reports",
      },
    ],
  },
];

export function NavLogistic() {
  const { handleOpenChange, isItemOpen } = useNavOpenItems(
    "logistics",
    navLogisticItems,
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Logistics</SidebarGroupLabel>
      <SidebarMenu>
        {navLogisticItems.map((item) => (
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
