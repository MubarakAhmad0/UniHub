"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export function SetStatusDialog({
  venueName,
  open,
  onOpenChange,
}: {
  venueName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [status, setStatus] = useState("available");

  const handleApply = () => {
    toast.success(`Status for ${venueName} updated to ${status}.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Status</DialogTitle>
          <DialogDescription>
            Update the operational status for {venueName}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <RadioGroup value={status} onValueChange={setStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="available" id="status-available" />
              <Label htmlFor="status-available">Available</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="maintenance" id="status-maintenance" />
              <Label htmlFor="status-maintenance">Under Maintenance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reserved" id="status-reserved" />
              <Label htmlFor="status-reserved">Reserved (Admin Hold)</Label>
            </div>
          </RadioGroup>

          {(status === "maintenance" || status === "reserved") && (
            <div className="space-y-4 pt-4 border-t animate-in fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="date-from">From</Label>
                  <Input type="date" id="date-from" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date-to">To</Label>
                  <Input type="date" id="date-to" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status-note">Note (Optional)</Label>
                <Textarea
                  id="status-note"
                  placeholder="Reason for downtime or reservation..."
                  className="resize-none"
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
