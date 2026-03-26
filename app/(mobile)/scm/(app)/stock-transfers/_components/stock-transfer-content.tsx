"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DatePicker } from "@/components/ui/date-picker";
import STCard from "./st-card";

interface StockTransferContentProps {
  isCargoStaff: boolean;
  initialDate: Date;
  departmentId: number;
  stockTransfers: any[]; // replace 'any' with your actual type
}

function EmptyState({ description }: { description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
      <p className="text-sm">{description}</p>
    </div>
  );
}

export default function StockTransferContent({
  isCargoStaff,
  initialDate,
  departmentId,
  stockTransfers,
}: StockTransferContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const date = new Date(selectedDate);
    date.setHours(12, 0, 0, 0);

    const params = new URLSearchParams(searchParams);
    params.set("date", date.toISOString().split("T")[0]);
    router.replace(`?${params.toString()}`);
  };

  const quickSelectOptions = [
    { label: "Today", value: "0", daysToAdd: 0 },
    { label: "Tomorrow", value: "1", daysToAdd: 1 },
    { label: "In 3 days", value: "3", daysToAdd: 3 },
    { label: "In a week", value: "7", daysToAdd: 7 },
  ];

  if (stockTransfers.length === 0) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-lg font-semibold">Stock Transfers</h1>
          <DatePicker
            value={initialDate}
            onChange={handleDateSelect}
            className="w-full"
            quickSelectOptions={quickSelectOptions}
          />
        </div>
        <EmptyState
          description={
            departmentId === 4
              ? "No pending or processing stock transfers for this date."
              : "No stock transfers to verify at cargo for this date."
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col space-y-4">
        <h1 className="text-lg font-semibold">Stock Transfers</h1>
        <DatePicker
          value={initialDate}
          onChange={handleDateSelect}
          className="w-full"
          quickSelectOptions={quickSelectOptions}
        />
      </div>
      <div className="space-y-4">
        <STCard
          data={stockTransfers}
          departmentId={departmentId}
          selectedDate={initialDate}
        />
      </div>
    </div>
  );
}
