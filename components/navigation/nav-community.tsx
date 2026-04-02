"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const communityNav = [
  {
    label: "Clubs & Societies",
    href: "/dashboard/community/clubs",
    icon: Users,
  },
  {
    label: "Marketplace",
    href: "/dashboard/community/marketplace",
    icon: ShoppingBag,
  },
];

export function NavCommunity() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Community</SidebarGroupLabel>
      <SidebarMenu>
        {communityNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
