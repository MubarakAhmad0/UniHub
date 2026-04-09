"use client";

import { Button } from "@/components/ui/button";
import { type Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { UserRow } from "./users-table-columns";

interface UsersTableToolbarActionsProps {
  table: Table<UserRow>;
  onCreateUser: () => void;
}

export function UsersTableToolbarActions({
  table,
  onCreateUser,
}: UsersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onCreateUser}>
        <Plus className="mr-2 size-4" aria-hidden="true" />
        New user
      </Button>
    </div>
  );
}
