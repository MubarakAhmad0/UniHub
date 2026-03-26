"use client";

import { type Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Role } from "@/db/schema/auth";
import { DeleteRolesDialog } from "./delete-roles-dialog";

interface RolesTableToolbarActionsProps {
  table: Table<Role & { permissionCount: number }>;
  onCreateRole: () => void;
}

export function RolesTableToolbarActions({
  table,
  onCreateRole,
}: RolesTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteRolesDialog
          roles={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => {
            table.toggleAllRowsSelected(false);
          }}
        />
      ) : null}
      <Button size="sm" onClick={onCreateRole}>
        <Plus className="mr-2 size-4" aria-hidden="true" />
        Create Role
      </Button>
    </div>
  );
}
