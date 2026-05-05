import { Layout, LayoutBody } from "@/components/ui/layout";
import { getCurrentUserFromDb } from "@/db/user";
import { redirect } from "next/navigation";
import UnauthorizedPage from "../unauthorized/page";
import { getDashboardSummary } from "./_lib/actions";

export default async function DashboardPage() {
  const dashboardSummaryData = await getDashboardSummary();
  const user = await getCurrentUserFromDb();

  if (!user) {
    return <UnauthorizedPage />;
  }

  if (user.newRole === "driver") {
    redirect("/driver");
  } else if (user.newRole === "florist") {
    redirect("/florist");
  }

  return (
    <Layout>
      <LayoutBody>
        {/* Dashboard temporarily disabled - redirecting to /dashboard/announcements */}
        {/* <DashboardHeader user={user} /> */}
        {/* <OrderDashboard dashboardSummary={dashboardSummaryData} /> */}
      </LayoutBody>
    </Layout>
  );
}
