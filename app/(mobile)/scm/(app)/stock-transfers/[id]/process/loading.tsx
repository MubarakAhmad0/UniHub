import { Skeleton } from "@/components/ui/skeleton";

const ProcessStockTransferLoading = () => {
  return (
    <div className="space-y-2">
      {/* skeleton for the title */}
      <div className="px-4">
        <Skeleton className="h-7 w-32" />
      </div>

      {/* skeleton for the items list or empty state */}
      <div className="space-y-2 px-4">
        {/* create multiple item skeletons */}
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="w-full h-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default ProcessStockTransferLoading;
