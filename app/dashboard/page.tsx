import { Layout, LayoutBody } from "@/components/ui/layout";
import { getCurrentUserFromDb } from "@/db/user";
import { redirect } from "next/navigation";
import UnauthorizedPage from "../unauthorized/page";
import DashboardHeader from "./_components/dashboard-header";
import { getDashboardSummary } from "./_lib/actions";
import OrderDashboard from "./_lib/components/order-dashboard";

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
        <DashboardHeader user={user} />
        <OrderDashboard dashboardSummary={dashboardSummaryData} />
      </LayoutBody>
    </Layout>
  );
}
