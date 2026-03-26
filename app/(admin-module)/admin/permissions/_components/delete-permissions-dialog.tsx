"use client";

import * as React from "react";
import { type Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Permission } from "@/db/schema/auth";
import { deletePermission } from "../_lib/actions";
import { toast } from "sonner";

interface DeletePermissionsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  permissions: Row<Permission>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeletePermissionsDialog({
  permissions,
  showTrigger = true,
  onSuccess,
  ...props
}: DeletePermissionsDialogProps) {
  const [isPending, startTransition] = React.useTransition();

  function onDelete() {
    startTransition(async () => {
      const promises = permissions.map((permission) =>
        deletePermission(permission.id),
      );

      try {
        const results = await Promise.all(promises);
        const failedResults = results.filter((result) => !result.success);

        if (failedResults.length > 0) {
          toast.error(`Failed to delete ${failedResults.length} permission(s)`);
        } else {
          toast.success(`Successfully deleted ${results.length} permission(s)`);
          onSuccess?.();
        }
      } catch (error) {
        toast.error("An error occurred while deleting permissions");
      }
    });
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 size-4" aria-hidden="true" />
            Delete ({permissions.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium">{permissions.length}</span>
            {permissions.length === 1 ? " permission" : " permissions"} from the
            system.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
