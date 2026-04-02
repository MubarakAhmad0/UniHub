"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FileText, MessageCircleWarning, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const servicesNav = [
  { label: "My Finances", href: "/dashboard/services/finances", icon: Wallet },
  {
    label: "Document Requests",
    href: "/dashboard/services/documents",
    icon: FileText,
  },
  {
    label: "Complaints & Appeals",
    href: "/dashboard/services/complaints",
    icon: MessageCircleWarning,
  },
];

export function NavServices() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin & Services</SidebarGroupLabel>
      <SidebarMenu>
        {servicesNav.map((item) => (
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
