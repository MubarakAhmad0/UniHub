// DashboardLayout.tsx (Server Component)
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { getAccessibleSidebarSections } from "@/lib/auth/sidebar-permissions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return redirect("/unauthorized");
  }

  // Get accessible sidebar sections based on user's roles
  const accessibleSections = await getAccessibleSidebarSections();

  const user = {
    email: session.user.email ?? "",
    name: session.user.name ?? "",
    image: session.user.image ?? "",
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user} accessibleSections={accessibleSections} />
      <SidebarInset>{children}</SidebarInset>
      <Toaster expand richColors />
    </SidebarProvider>
  );
}
