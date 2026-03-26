"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item, StockTransferDetails } from "@/db/schema";
import { useDialog } from "@/hooks/use-dialog";
import { ImageIcon } from "@radix-ui/react-icons";
import { ClipboardList, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { fulfillStockTransfer } from "../_lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type STDetailsWithItem = StockTransferDetails & {
  item: Item;
};

interface ItemsProps {
  data: STDetailsWithItem[];
}

const calculateBundleInfo = (stalks: number, factor: number) => {
  if (!factor || factor <= 1) return { bundles: stalks };
  return { bundles: stalks / factor };
};

const Items = ({ data }: ItemsProps) => {
  const dialog = useDialog();
  const router = useRouter();
  const stockTransferId = data[0].stockTransferId;

  const [fulfilledQuantities, setFulfilledQuantities] = useState<{
    [key: number]: number;
  }>({});

  // add input mode state for each item
  const [inputModes, setInputModes] = useState<{
    [key: number]: "bundle" | "stalk";
  }>({});

  const areAllQuantitiesZero = () => {
    return Object.values(fulfilledQuantities).every(
      (quantity) => quantity === 0,
    );
  };

  const handleQuantityChange = (
    id: number,
    change: number | "input",
    inputValue?: number,
    mode: "bundle" | "stalk" = "bundle",
  ) => {
    setFulfilledQuantities((prev) => {
      const item = data.find((std) => std.id === id);
      if (!item) return prev;

      const factor = Number(item.item.factor) || 1;
      const currentStalks = prev[id] || 0;

      // if factor <= 1, always use stalk mode regardless of input mode
      if (factor <= 1) {
        let newStalks = currentStalks;

        if (change === "input") {
          newStalks = Math.round(inputValue || 0);
        } else {
          newStalks = currentStalks + change;
        }

        newStalks = Math.max(0, newStalks);

        return {
          ...prev,
          [id]: newStalks,
        };
      }

      // handle different input modes for factor > 1
      if (mode === "stalk") {
        let newStalks = currentStalks;

        if (change === "input") {
          // ensure stalk input is multiple of 10
          newStalks = Math.round((inputValue || 0) / 10) * 10;
        } else {
          // increment/decrement by 10 stalks
          newStalks = currentStalks + change * 10;
        }

        newStalks = Math.max(0, newStalks);

        return {
          ...prev,
          [id]: newStalks,
        };
      } else {
        // bundle mode
        const currentBundles = currentStalks / factor;
        let newBundles = currentBundles;

        if (change === "input") {
          newBundles = inputValue !== undefined ? inputValue : currentBundles;
        } else {
          newBundles = currentBundles + change;
        }

        newBundles = Math.max(0, newBundles);

        return {
          ...prev,
          [id]: newBundles * factor,
        };
      }
    });
  };

  const getStatusColor = (fulfilled: number, required: number) => {
    if (fulfilled === 0) return "text-red-500";
    if (fulfilled === required) return "text-green-500";
    return "text-yellow-500";
  };

  const handleOpenConfirmDialog = () => {
    const unfulfilledItems = getUnfulfilledItems();
    dialog.setData({ unfulfilledItems, fulfilledQuantities });
    dialog.onOpen();
  };

  const getRemainingQuantity = (item: STDetailsWithItem) => {
    const fulfilled = fulfilledQuantities[item.id] || 0;
    const adjustedQuantity = Number(item.adjustedQuantity);

    return adjustedQuantity - fulfilled;
  };

  const getUnfulfilledItems = () => {
    return data.filter((item) => {
      const fulfilled = fulfilledQuantities[item.id] || 0;
      return fulfilled < Number(item.adjustedQuantity);
    });
  };

  const getFulfilledItems = () => {
    return data.filter((item) => {
      const fulfilled = fulfilledQuantities[item.id] || 0;
      return fulfilled === Number(item.adjustedQuantity);
    });
  };

  const handleSubmit = async () => {
    const fulfilledItems = getFulfilledItems();
    const unfulfilledItems = getUnfulfilledItems();

    const res = await fulfillStockTransfer(
      stockTransferId,
      fulfilledItems,
      unfulfilledItems,
      fulfilledQuantities,
    );

    if (res.data) {
      toast.success("Successfully submitted stock transfer!");

      if (unfulfilledItems.length > 0) {
        toast.success("A partial stock transfer has been created!");
      }

      router.push("/scm/stock-transfers");
    } else {
      toast.error(res.error);
    }

    dialog.onClose();
  };

  return (
    <div className="space-y-4">
      {data.map((std) => {
        const fulfilledQuantity = fulfilledQuantities[std.id] || 0;
        const adjustedQuantity = parseInt(std.adjustedQuantity!, 10);
        const statusColor = getStatusColor(fulfilledQuantity, adjustedQuantity);

        return (
          <div
            key={std.id}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-medium">{std.item.name}</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <Image
                    src={std.item.image ?? "/icon.jpg"}
                    alt={std.item.name}
                    width={300}
                    height={300}
                    className="w-full rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-gray-600">Required:</span>
              <Badge variant="destructive" className="rounded-full px-3">
                {(() => {
                  const { bundles } = calculateBundleInfo(
                    Number(adjustedQuantity),
                    Number(std.item.factor) || 1,
                  );

                  if (std.item.factor && Number(std.item.factor) > 1) {
                    return `${bundles} bundle${bundles > 1 ? "s" : ""}`;
                  }
                  return `${adjustedQuantity} stalks`;
                })()}
              </Badge>
            </div>

            <div className="mt-4">
              <ToggleGroup
                type="single"
                value={
                  Number(std.item.factor) > 1
                    ? inputModes[std.id] || "bundle"
                    : "stalk"
                }
                onValueChange={(value) => {
                  if (value && Number(std.item.factor) > 1) {
                    setInputModes((prev) => ({
                      ...prev,
                      [std.id]: value as "bundle" | "stalk",
                    }));
                  }
                }}
                className="w-full grid grid-cols-2 rounded-xl overflow-hidden bg-gray-50"
                disabled={Number(std.item.factor) <= 1}
              >
                <ToggleGroupItem
                  value="bundle"
                  aria-label="Bundle mode"
                  className="data-[state=on]:bg-black data-[state=on]:text-white py-2.5 rounded-none"
                >
                  Bundles
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="stalk"
                  aria-label="Stalk mode"
                  className="data-[state=on]:bg-black data-[state=on]:text-white py-2.5 rounded-none"
                >
                  Stalks
                </ToggleGroupItem>
              </ToggleGroup>

              <div className="flex items-center justify-between mt-4 gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl bg-gray-50"
                  onClick={() =>
                    handleQuantityChange(
                      std.id,
                      -1,
                      undefined,
                      inputModes[std.id] || "bundle",
                    )
                  }
                  disabled={
                    inputModes[std.id] === "stalk"
                      ? (fulfilledQuantities[std.id] || 0) <= 0
                      : std.item.factor && Number(std.item.factor) > 1
                        ? (fulfilledQuantities[std.id] || 0) /
                            Number(std.item.factor) <=
                          0
                        : (fulfilledQuantities[std.id] || 0) <= 0
                  }
                >
                  <Minus className="h-6 w-6" />
                </Button>
                <Input
                  type="number"
                  value={
                    inputModes[std.id] === "stalk"
                      ? fulfilledQuantities[std.id] || 0
                      : std.item.factor && Number(std.item.factor) > 1
                        ? (fulfilledQuantities[std.id] || 0) /
                          Number(std.item.factor)
                        : fulfilledQuantities[std.id] || 0
                  }
                  onChange={(e) =>
                    handleQuantityChange(
                      std.id,
                      "input",
                      Number(e.target.value),
                      inputModes[std.id] || "bundle",
                    )
                  }
                  className="h-12 text-center text-xl font-medium rounded-xl bg-gray-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  step={
                    Number(std.item.factor) > 1 &&
                    inputModes[std.id] === "stalk"
                      ? "10"
                      : "1"
                  }
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl bg-gray-50"
                  onClick={() =>
                    handleQuantityChange(
                      std.id,
                      1,
                      undefined,
                      inputModes[std.id] || "bundle",
                    )
                  }
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-600">Fulfilled Quantity:</div>
                <div className={`mt-1 text-base font-medium ${statusColor}`}>
                  {(() => {
                    const { bundles: fulfilledBundles } = calculateBundleInfo(
                      fulfilledQuantity,
                      Number(std.item.factor) || 1,
                    );
                    const { bundles: totalBundles } = calculateBundleInfo(
                      adjustedQuantity,
                      Number(std.item.factor) || 1,
                    );

                    if (std.item.factor && Number(std.item.factor) > 1) {
                      return `${fulfilledBundles} / ${totalBundles} bundle${totalBundles > 1 ? "s" : ""}`;
                    }
                    return `${fulfilledQuantity} / ${adjustedQuantity} stalks`;
                  })()}
                </div>
              </div>

              <div className={`mt-2 text-sm font-medium ${statusColor}`}>
                {fulfilledQuantity === 0
                  ? "Incomplete"
                  : fulfilledQuantity === adjustedQuantity
                    ? "Completed"
                    : fulfilledQuantity > adjustedQuantity
                      ? "Exceeded"
                      : "Partial"}
              </div>
            </div>
          </div>
        );
      })}

      <Button
        className="w-full h-12 rounded-xl mt-6 text-base"
        onClick={handleOpenConfirmDialog}
        disabled={areAllQuantitiesZero()}
      >
        <ClipboardList className="w-5 h-5 mr-2" />
        Finish
      </Button>

      <Dialog open={dialog.isOpen} onOpenChange={dialog.onClose}>
        <DialogContent className="max-h-[90vh] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <DialogHeader>
                <DialogTitle className="text-lg">
                  {dialog.data?.unfulfilledItems?.length > 0
                    ? "Review Unfulfilled Items"
                    : "Confirm Submission"}
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="flex-1 px-4">
              <DialogDescription className="py-4">
                {dialog.data?.unfulfilledItems?.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-amber-600">
                      The following items are partially fulfilled or
                      unavailable. A partial stock transfer will be created for
                      these items:
                    </p>
                    <ScrollArea className="h-full max-h-[40vh]">
                      <div className="space-y-3 pr-4">
                        {dialog.data.unfulfilledItems.map(
                          (item: STDetailsWithItem) => {
                            const fulfilled =
                              dialog.data.fulfilledQuantities[item.id] || 0;
                            const required = Number(item.adjustedQuantity);
                            const remaining = getRemainingQuantity(item);

                            return (
                              <div
                                key={item.id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                              >
                                <span className="font-medium">
                                  {item.item.name}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {fulfilled}/{required} (Remaining: {remaining}
                                  )
                                </span>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <p>Are you sure you want to submit this stock transfer?</p>
                )}
              </DialogDescription>
            </div>

            <div className="p-4 border-t mt-auto">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={dialog.onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11"
                  variant={
                    dialog.data?.unfulfilledItems?.length > 0
                      ? "destructive"
                      : "default"
                  }
                  onClick={handleSubmit}
                >
                  {dialog.data?.unfulfilledItems?.length > 0
                    ? "Submit Anyway"
                    : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Items;
