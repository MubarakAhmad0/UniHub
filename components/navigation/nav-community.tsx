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
import { ChevronRight, ShoppingBag, Users2, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navCommunityItems = [
  {
    title: "Community",
    url: "#",
    icon: UsersRound,
    isActive: true,
    items: [
      {
        title: "Clubs & Societies",
        href: "/dashboard/community/clubs",
        icon: Users2,
      },
      {
        title: "Marketplace",
        href: "/dashboard/community/marketplace",
        icon: ShoppingBag,
      },
    ],
  },
];

export function NavCommunity() {
  const pathname = usePathname();
  const { isItemOpen, handleOpenChange } = useNavOpenItems(
    "community",
    navCommunityItems,
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Community</SidebarGroupLabel>
      <SidebarMenu>
        {navCommunityItems.map((section) => (
          <Collapsible
            key={section.title}
            asChild
            open={isItemOpen(section.title)}
            onOpenChange={(isOpen) => handleOpenChange(section.title, isOpen)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={section.title}>
                  {section.icon && <section.icon />}
                  <span>{section.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {section.items?.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
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
