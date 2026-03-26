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
import { ChevronRight, Crown, HandCoins, Phone, Receipt } from "lucide-react";
import Link from "next/link";

const navCustomerServiceItems = [
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
      {
        title: "Search Order",
        url: "/dashboard/cs/search-order",
      },
      {
        title: "TikTok Approvals",
        url: "/dashboard/cs/tiktok-approvals?status=pending",
      },
      {
        title: "TikTok Orders",
        url: "/dashboard/cs/tiktok-orders",
      },
      {
        title: "Approvals",
        url: "/dashboard/cs/approvals",
      },
    ],
  },
  {
    title: "CS/CRD Orders",
    url: "#",
    icon: HandCoins,
    isActive: false,
    items: [
      {
        title: "List Of CS/CRD Order",
        url: "/dashboard/cs/offline-orders",
      },
      {
        title: "Create CS/CRD Order",
        url: "/dashboard/cs/offline-orders/create",
      },
    ],
  },
  {
    title: "Customer Care",
    url: "#",
    icon: Crown,
    isActive: false,
    items: [
      {
        title: "Customer Care Dashboard",
        url: "/dashboard/cs/vip/dashboard",
      },
    ],
  },
  {
    title: "WhatsApp",
    url: "#",
    icon: Phone,
    isActive: false,
    items: [
      // {
      //   title: "Missing Date & Phone Number",
      //   url: "/dashboard/cs/whatsapp/missing",
      // },
      // {
      //   title: "Notification Log",
      //   url: "/dashboard/cs/whatsapp/log",
      // },
      {
        title: "WhatsApp Notification",
        url: "/dashboard/cs/whatsapp",
      },
    ],
  },
  // {
  //   title: "Peak Season Forecasts",
  //   url: "#",
  //   icon: SunSnowIcon,
  //   isActive: false,
  //   items: [
  //     {
  //       title: "Peak Season Forecaster",
  //       url: "/dashboard/products/peak-season-forecasts",
  //     },
  //   ],
  // },
];

export function NavCustomerService() {
  const { handleOpenChange, isItemOpen } = useNavOpenItems(
    "customer-service",
    navCustomerServiceItems,
  );
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Customer Service</SidebarGroupLabel>
      <SidebarMenu>
        {navCustomerServiceItems.map((item) => (
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
