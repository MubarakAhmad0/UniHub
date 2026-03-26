"use client";

import React, { useState } from "react";
import { PackageCheck, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/app/contexts/user";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { toast } from "sonner";

interface MobileLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const SCMLayout = ({ children }: MobileLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useUser();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const { data: session, isPending, error } = useSession();

  if (!session && !isPending) {
    router.push("/scm/login");
  }

  if (error) {
    toast.error("Error getting session info");
  }

  const primaryNavItems: NavItem[] = [
    {
      href: "/scm/stock-transfers",
      label: "Stock Transfer",
      icon: PackageCheck,
    },
  ];

  const secondaryNavItems: NavItem[] = [
    // Add secondary nav items here when needed
    // Example:
    // { href: "/scm/stock-check", label: "Stock Check", icon: ClipboardCheck },
  ];

  const handleLogout = async () => {
    setUser(null);
    signOut();
    document.cookie = "user=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/scm/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background border-b z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
              App
            </div>
            <h1 className="text-lg font-semibold">
              {primaryNavItems.find((item) => pathname.includes(item.href))
                ?.label || "SCM"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-6 w-6"
            >
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">{children}</main>

      <nav className="fixed bottom-0 w-full bg-background border-t z-40">
        <div className="flex justify-around py-2 relative">
          {primaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center px-3 py-2 group"
            >
              {pathname === item.href && (
                <span className="absolute inset-0 bg-accent rounded-md" />
              )}
              <item.icon
                className={cn(
                  "w-6 h-6 relative z-10 transition-colors duration-200",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary/80",
                )}
              />
              <span
                className={cn(
                  "text-xs mt-1 relative z-10 transition-colors duration-200",
                  pathname === item.href
                    ? "text-primary font-medium"
                    : "text-muted-foreground group-hover:text-primary/80",
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}

          {(secondaryNavItems.length > 0 || true) && (
            <div
              className="relative flex flex-col items-center px-3 py-2 group cursor-pointer"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            >
              {isMoreMenuOpen ? (
                <ChevronUp className="w-6 h-6 text-muted-foreground group-hover:text-primary/80" />
              ) : (
                <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-primary/80" />
              )}
              <span className="text-xs mt-1 text-muted-foreground group-hover:text-primary/80">
                More
              </span>

              {isMoreMenuOpen && (
                <div className="absolute bottom-full mb-2 w-48 bg-background border rounded-lg shadow-lg z-50">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center px-4 py-2 hover:bg-accent transition-colors duration-200"
                    >
                      <item.icon className="w-5 h-5 mr-2 text-muted-foreground" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default SCMLayout;
