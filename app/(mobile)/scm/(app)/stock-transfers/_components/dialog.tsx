"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/hooks/use-dialog";
import { useLoading } from "@/hooks/use-loading";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateStatus } from "../_lib/actions";

const ConfirmationDialog = () => {
  const { isOpen, onClose, data: stId } = useDialog();
  const router = useRouter();
  const { isLoading, withLoading } = useLoading();

  const process = async () => {
    if (!stId) {
      toast.error("Stock transfer ID is missing");
      return;
    }

    try {
      const res = await updateStatus(stId);

      if (res.error) {
        toast.error("Failed to process stock transfer.");
        console.error(res.error);
        return;
      }

      router.push(`/scm/stock-transfers/${stId}/process`);
      toast.success("Stock transfer processing started successfully!");
    } catch (error) {
      console.error("Error updating stock transfer status:", error);
      toast.error("Failed to process stock transfer.");
    } finally {
      onClose();
    }
  };

  const handleConfirm = withLoading(process);

  // TODO: should we use shadcn alert dialog instead?
  return (
    <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
        </DialogHeader>
        Are you sure you want to start processing this stock transfer?
        <DialogFooter className="flex flex-row justify-center gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
