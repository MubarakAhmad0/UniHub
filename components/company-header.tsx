import Link from "next/link";
import ThemeSwitch from "./theme-switcher";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Image from "next/image";

export function CompanyHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <div className="flex flex-row justify-between">
            <div>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  {/* Replace with your company logo */}
                  App
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold"></span>
                </div>
              </Link>
            </div>

            <div className="flex flex-col items-end">
              <ThemeSwitch />
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
