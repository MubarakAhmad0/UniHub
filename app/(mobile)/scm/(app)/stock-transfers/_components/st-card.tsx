"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Branch, StockTransfer, StockTransferDetails, User } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import ConfirmationDialog from "./dialog";
import { useDialog } from "@/hooks/use-dialog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type StockTransferWithDetails = StockTransfer & {
  branch: Branch;
  pendingUser: User;
  details: StockTransferDetails[];
};

interface STCardProps {
  data: StockTransferWithDetails[];
  departmentId: number;
  selectedDate: Date;
}

const STCard = ({ data, departmentId, selectedDate }: STCardProps) => {
  const { onOpen, setData } = useDialog();

  function handleProcess(id: number) {
    setData(id);
    onOpen();
  }

  // check if selected date is before today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDateStart = new Date(selectedDate);
  selectedDateStart.setHours(0, 0, 0, 0);
  const isHistoricalDate = selectedDateStart < today;

  // determine if we should show action buttons based on status and date
  const shouldShowButton = (status: string | null) => {
    if (!status) return false;
    if (!isHistoricalDate) return true; // always show buttons for today/future
    return status === "PENDING" || status === "PROCESSING"; // only show for these statuses in past
  };

  return (
    <>
      {data.map((st) => (
        <Card
          key={st.id}
          className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 rounded-lg"
        >
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
            {/* Left Section: ST Details */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{st.stNumber}</h2>
              <p className="text-sm text-muted-foreground">
                {st.pendingUser.name} → {st.branch.code}
              </p>
              {st.parentStId && (
                <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted">
                  <span className="text-sm text-muted-foreground">
                    <strong>Partial for:</strong>
                  </span>
                  <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                    ST{st.parentStId}
                  </span>
                </div>
              )}
              {st.requestNotes && (
                <div className="p-2 border rounded-md bg-muted">
                  <p className="text-sm text-muted-foreground">
                    <strong>Request Notes:</strong>
                  </p>
                  <p className="text-sm font-medium">{st.requestNotes}</p>
                </div>
              )}
            </div>

            {/* Right Section: Date and Status */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {formatDate(st.createdAt, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <Badge
                variant={st.status === "PENDING" ? "default" : "destructive"}
                className="mt-2 sm:mt-0"
              >
                {st.status}
              </Badge>
            </div>
          </div>

          {/* Bottom Section: Item Count and Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            <div className="bg-primary/10 rounded-lg px-3 py-2 sm:px-4 sm:py-2">
              <span className="text-lg font-semibold text-primary">
                {st.details.length}
              </span>
              <span className="text-sm text-primary ml-1">
                {st.details.length === 1 ? "item" : "items"}
              </span>
            </div>
            {shouldShowButton(st.status) &&
              (st.status === "PENDING" ? (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full sm:w-24"
                  onClick={() => handleProcess(st.id)}
                >
                  {departmentId === 4 ? "Process" : "Verify"}
                </Button>
              ) : (
                <Link
                  href={`/scm/stock-transfers/${st.id}/${departmentId === 4 ? "process" : "verify"}`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full sm:w-24"
                  >
                    Continue
                  </Button>
                </Link>
              ))}
          </div>
        </Card>
      ))}

      <ConfirmationDialog />
    </>
  );
};

export default STCard;
