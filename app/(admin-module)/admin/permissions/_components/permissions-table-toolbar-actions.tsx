"use client";

import { type Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Permission } from "@/db/schema/auth";
import { DeletePermissionsDialog } from "./delete-permissions-dialog";

interface PermissionsTableToolbarActionsProps {
  table: Table<Permission>;
  onCreatePermission: () => void;
}

export function PermissionsTableToolbarActions({
  table,
  onCreatePermission,
}: PermissionsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeletePermissionsDialog
          permissions={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => {
            table.toggleAllRowsSelected(false);
          }}
        />
      ) : null}
      <Button size="sm" onClick={onCreatePermission}>
        <Plus className="mr-2 size-4" aria-hidden="true" />
        Create Permission
      </Button>
    </div>
  );
}
