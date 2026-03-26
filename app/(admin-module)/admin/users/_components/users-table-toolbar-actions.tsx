"use client";

import { DeleteUsersDialog } from "@/app/(admin-module)/admin/users/_components/delete-users-dialog";
import { Button } from "@/components/ui/button";
import { type Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import * as React from "react";
import { UserRow } from "./users-table-columns";

interface UsersTableToolbarActionsProps {
  table: Table<UserRow>;
  onCreateUser: () => void;
}

export function UsersTableToolbarActions({
  table,
  onCreateUser,
}: UsersTableToolbarActionsProps) {
  const [showDeleteUsersDialog, setShowDeleteUsersDialog] =
    React.useState(false);

  return (
    <div className="flex items-center gap-2">
      {table.getSelectedRowModel().flatRows.length > 0 && (
        <DeleteUsersDialog
          open={showDeleteUsersDialog}
          onOpenChange={setShowDeleteUsersDialog}
          users={table
            .getSelectedRowModel()
            .flatRows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      )}
      <Button variant="outline" size="sm" onClick={onCreateUser}>
        <Plus className="mr-2 size-4" aria-hidden="true" />
        New user
      </Button>
    </div>
  );
}
