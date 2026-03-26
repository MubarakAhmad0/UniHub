"use client";

import { Trash2 } from "lucide-react";
import * as React from "react";

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
import { toast } from "sonner";
import { deleteUsers } from "../_lib/actions";
import { UserRow } from "./users-table-columns";

interface DeleteUsersDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  users: UserRow[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteUsersDialog({
  users,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteUsersDialogProps) {
  const [isPending, startTransition] = React.useTransition();

  function onDelete() {
    startTransition(async () => {
      try {
        await deleteUsers({
          ids: users.map((user) => user.id),
        });
        toast.success(`Successfully deleted ${users.length} user(s)`);
        onSuccess?.();
      } catch (error) {
        toast.error("An error occurred while deleting users");
      }
    });
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 size-4" aria-hidden="true" />
            Delete ({users.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium">{users.length}</span>
            {users.length === 1 ? " user" : " users"} from the system.
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
