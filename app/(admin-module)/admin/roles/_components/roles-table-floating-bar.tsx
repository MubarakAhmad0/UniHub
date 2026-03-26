"use client";

import * as React from "react";
import { type Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Role } from "@/db/schema/auth";
import { DeleteRolesDialog } from "./delete-roles-dialog";

interface RolesTableFloatingBarProps {
  table: Table<Role & { permissionCount: number }>;
}

export function RolesTableFloatingBar({ table }: RolesTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  if (rows.length <= 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4">
      <div className="w-full overflow-x-auto">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
          <div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
            <span className="whitespace-nowrap text-xs">
              {rows.length} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-auto p-1 text-muted-foreground"
              onClick={() => table.toggleAllRowsSelected(false)}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <DeleteRolesDialog
            roles={rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
            showTrigger={false}
          />
        </div>
      </div>
    </div>
  );
}
