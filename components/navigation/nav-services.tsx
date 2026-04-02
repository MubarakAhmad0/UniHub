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
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  MessageCircleWarning,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navServicesItems = [
  {
    title: "Services",
    url: "#",
    icon: BriefcaseBusiness,
    isActive: true,
    items: [
      {
        title: "My Finances",
        href: "/dashboard/services/finances",
        icon: Wallet,
      },
      {
        title: "Document Requests",
        href: "/dashboard/services/documents",
        icon: FileText,
      },
      {
        title: "Complaints & Appeals",
        href: "/dashboard/services/complaints",
        icon: MessageCircleWarning,
      },
    ],
  },
];

export function NavServices() {
  const pathname = usePathname();
  const { isItemOpen, handleOpenChange } = useNavOpenItems(
    "services",
    navServicesItems,
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin & Services</SidebarGroupLabel>
      <SidebarMenu>
        {navServicesItems.map((section) => (
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
