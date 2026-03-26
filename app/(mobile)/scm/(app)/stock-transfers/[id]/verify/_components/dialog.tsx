"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import { PackageCheck } from "lucide-react";

interface ConfirmationDialogProps {
  onConfirm: () => Promise<void>;
}

const ConfirmationDialog = ({ onConfirm }: ConfirmationDialogProps) => {
  const { isOpen, onClose } = useDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            Confirm Verification
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to verify this stock transfer? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>Confirm</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
