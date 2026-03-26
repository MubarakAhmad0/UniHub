"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StockTransferDetails } from "@/db/schema";
import { useDialog } from "@/hooks/use-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyStockTransfer } from "../_lib/actions";
import ConfirmationDialog from "./dialog";

// helper function to convert stalks to bundles
const calculateBundleInfo = (stalks: number, factorStr: string | null) => {
  const factor = factorStr ? parseFloat(factorStr) : 1;
  if (!factor || factor <= 1) return { bundles: stalks, stalks };

  const bundles = Math.ceil(stalks / factor);
  const totalStalks = bundles * factor;

  return { bundles, stalks: totalStalks };
};

type STDetailsWithItem = StockTransferDetails & {
  item: {
    id: number;
    name: string;
    unit: string;
    factor: string | null;
  };
};

interface ItemsProps {
  data: STDetailsWithItem[];
}

const Items = ({ data }: ItemsProps) => {
  const dialog = useDialog();
  const router = useRouter();
  const stockTransferId = data[0].stockTransferId;

  const [verifiedQuantities, setVerifiedQuantities] = useState<{
    [key: number]: number;
  }>({});

  const handleQuantityChange = (
    id: number,
    change: number | "input",
    inputValue?: number,
  ) => {
    setVerifiedQuantities((prev) => {
      const currentQuantity = prev[id] || 0;
      let newQuantity = currentQuantity;

      if (change === "input") {
        newQuantity = inputValue !== undefined ? inputValue : currentQuantity;
      } else {
        newQuantity = currentQuantity + change;
      }

      const item = data.find((std) => std.id === id);
      if (item) {
        // ensure verified quantity doesn't exceed fulfilled quantity
        newQuantity = Math.max(
          0,
          Math.min(newQuantity, Number(item.fulfilledQuantity)),
        );
      }

      return {
        ...prev,
        [id]: newQuantity,
      };
    });
  };

  const handleOpenConfirmDialog = () => {
    dialog.setData({ verifiedQuantities });
    dialog.onOpen();
  };

  // TODO: check with azim again if we need this verification step
  const handleSubmit = async () => {
    const res = await verifyStockTransfer(stockTransferId, verifiedQuantities);

    if (res.data) {
      toast.success("Successfully verified stock transfer!");
      router.push("/scm/stock-transfers");
    } else {
      toast.error(res.error);
    }

    dialog.onClose();
  };

  return (
    <>
      <div className="space-y-4 p-4">
        {data.map((std) => {
          const verifiedQuantity = verifiedQuantities[std.id] || 0;
          const adjustedQuantity = Number(std.adjustedQuantity);
          const fulfilledQuantity = Number(std.fulfilledQuantity);
          const { bundles: adjustedBundles } = calculateBundleInfo(
            adjustedQuantity,
            std.item.factor,
          );
          const { bundles: fulfilledBundles } = calculateBundleInfo(
            fulfilledQuantity,
            std.item.factor,
          );

          return (
            <Card key={std.id} className="overflow-hidden">
              {/* item details */}
              <div className="p-4 space-y-2">
                <h3 className="font-medium">{std.item.name}</h3>

                {/* quantities display */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Adjusted Quantity:</p>
                    <p className="font-medium">
                      {std.item.factor && parseFloat(std.item.factor) > 1
                        ? `${adjustedBundles} bundle${
                            adjustedBundles > 1 ? "s" : ""
                          } (${adjustedQuantity} stalks)`
                        : `${adjustedQuantity} stalks`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fulfilled Quantity:</p>
                    <p className="font-medium">
                      {std.item.factor && parseFloat(std.item.factor) > 1
                        ? `${fulfilledBundles} bundle${
                            fulfilledBundles > 1 ? "s" : ""
                          } (${fulfilledQuantity} stalks)`
                        : `${fulfilledQuantity} stalks`}
                    </p>
                  </div>
                </div>
              </div>

              {/* verify quantity input */}
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-muted-foreground mb-2">
                  Verify Quantity:
                </p>
                <div className="flex items-center justify-between space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 bg-white"
                    onClick={() => handleQuantityChange(std.id, -1)}
                    disabled={verifiedQuantity === 0}
                  >
                    <span className="text-lg">-</span>
                  </Button>
                  <Input
                    type="number"
                    value={verifiedQuantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        std.id,
                        "input",
                        Number(e.target.value),
                      )
                    }
                    className="w-20 text-center text-lg h-10 bg-white"
                    min="0"
                    max={fulfilledQuantity}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 bg-white"
                    onClick={() => handleQuantityChange(std.id, 1)}
                    disabled={verifiedQuantity === fulfilledQuantity}
                  >
                    <span className="text-lg">+</span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {/* submit button */}
        <Button
          className="w-full"
          onClick={handleOpenConfirmDialog}
          disabled={Object.keys(verifiedQuantities).length === 0}
        >
          Verify Stock Transfer
        </Button>
      </div>

      <ConfirmationDialog onConfirm={handleSubmit} />
    </>
  );
};

export default Items;
