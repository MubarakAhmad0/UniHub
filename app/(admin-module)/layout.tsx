import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/app-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  const user = {
    name: session?.user?.name ?? "Admin",
    email: session?.user?.email ?? "admin@example.com",
    avatar: session?.user?.image ?? "",
  };
  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <SidebarInset>{children}</SidebarInset>
      <Toaster richColors />
    </SidebarProvider>
  );
}
