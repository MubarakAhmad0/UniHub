"use client";

import { CompanyHeader } from "@/components/company-header";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { SidebarSection } from "@/lib/auth/sidebar-permissions";

import { FileKey2, IdCard, Shield, UserIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { NavAcademic } from "./navigation/nav-academic";
import { NavAdmin } from "./navigation/nav-admin";
import { NavCampus } from "./navigation/nav-campus";
import { NavCommunity } from "./navigation/nav-community";
import { NavServices } from "./navigation/nav-services";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    email?: string;
    name?: string;
    image?: string;
  };
  accessibleSections: SidebarSection[];
}

export function AppSidebar({
  user,
  accessibleSections,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavAcademic />
        <NavCampus />
        <NavCommunity />
        <NavServices />
        {accessibleSections.includes("admin") && <NavAdmin />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.name ?? "",
            email: user.email ?? "",
            avatar: user.image ?? "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export const AdminSidebar = (
  props: React.ComponentProps<typeof Sidebar> & {
    user: any;
  },
) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/users">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" />
                    <span>Manage Users</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/roles">
                  <div className="flex items-center gap-2">
                    <IdCard className="w-4 h-4" />
                    <span>Manage Roles</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/permissions">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Manage Permissions</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/password-changer">
                  <div className="flex items-center gap-2">
                    <FileKey2 className="w-4 h-4" />
                    <span>Password Changer</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
