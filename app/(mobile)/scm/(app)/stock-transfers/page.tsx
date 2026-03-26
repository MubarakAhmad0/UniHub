import { getCurrentUserFromDb } from "@/db/user";
import { Suspense } from "react";
import StockTransferContent from "./_components/stock-transfer-content";
import { getStockTransfers } from "./_lib/queries";

interface SearchParams {
  date?: string;
}

function ErrorState({ description, className }: { description: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center text-destructive ${className ?? ""}`}>
      <p className="text-sm font-medium">{description}</p>
    </div>
  );
}

export default async function StockTransferPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const user = await getCurrentUserFromDb();

  if (!user) {
    return <ErrorState description="User not found." />;
  }

  const departmentId = user.departmentId ?? 0;

  const isInventoryStaff =
    departmentId === 4 ||
    user.jobTitle === "Inventory Control Executive" ||
    user.jobTitle === "Inventory Assistant";

  if (!isInventoryStaff) {
    return (
      <div className="p-4">
        <p>{user.jobTitle}</p>
        <ErrorState
          description="You are not authorized to view this page."
          className="p-4"
        />
      </div>
    );
  }

  const selectedDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();
  const isCargoStaff = departmentId !== 4;

  const res = await getStockTransfers(isCargoStaff, selectedDate);

  if (res.error) {
    return <ErrorState description={res.error} />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StockTransferContent
        isCargoStaff={isCargoStaff}
        initialDate={selectedDate}
        departmentId={departmentId}
        stockTransfers={res.data || []}
      />
    </Suspense>
  );
}
