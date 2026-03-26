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
import { ChevronRight, Computer } from "lucide-react";
import Link from "next/link";

const navTechItems = [
  {
    title: "Tech Tools",
    url: "/dashboard/tech",
    icon: Computer,
    isActive: false,
    items: [
      {
        title: "Missing Order Tool",
        url: "/dashboard/tech/missing-order-tool",
      },
      {
        title: "Compare Orders",
        url: "/dashboard/tech/order-compare",
      },
      {
        title: "Test Timezone",
        url: "/dashboard/tech/test-timezone",
      },
      {
        title: "Tiktok Tool",
        url: "/dashboard/tech/tiktok-tool",
      },
      {
        title: "View Order",
        url: "/dashboard/tech/view-order",
      },
      {
        title: "Whatsapp Templates",
        url: "/dashboard/tech/whatsapp-templates",
      },
    ],
  },
];

export function NavTech() {
  const { handleOpenChange, isItemOpen } = useNavOpenItems(
    "tech",
    navTechItems,
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tech</SidebarGroupLabel>
      <SidebarMenu>
        {navTechItems.map((item) => (
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
