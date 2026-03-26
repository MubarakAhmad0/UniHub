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

const navCeoOfficeItems = [
  {
    title: "CEO Product Requests",
    url: "#",
    icon: HandCoins,
    isActive: false,
    items: [
      {
        title: "List CEO Product Requests",
        url: "/dashboard/ceo-office/offline-orders",
      },
      {
        title: "Create CEO Product Request",
        url: "/dashboard/ceo-office/offline-orders/create",
      },
    ],
  },
];

export function NavCeoOffice() {
  const { handleOpenChange, isItemOpen } = useNavOpenItems(
    "ceo-office",
    navCeoOfficeItems,
  );
  return (
    <SidebarGroup>
      <SidebarGroupLabel>CEO Office</SidebarGroupLabel>
      <SidebarMenu>
        {navCeoOfficeItems.map((item) => (
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
