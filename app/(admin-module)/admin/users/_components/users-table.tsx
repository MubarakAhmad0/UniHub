"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableFilterField, DataTableRowAction } from "@/types";
import { use, useMemo, useState } from "react";
import { getRoles } from "../../roles/_lib/actions";
import { getDepartments, getUsers } from "../_lib/actions";
import { DeleteUsersDialog } from "./delete-users-dialog";
import UpdateUserSheet from "./update-user-sheet";
import { UserDialog } from "./user-dialog";
import { getColumns, UserRow } from "./users-table-columns";
import { UsersTableToolbarActions } from "./users-table-toolbar-actions";

export type Data = Awaited<ReturnType<typeof getUsers>>["data"];

export interface UsersTableProps {
  promises: Promise<{
    users: Awaited<ReturnType<typeof getUsers>>;
    departments: Awaited<ReturnType<typeof getDepartments>>;
    roles: Awaited<ReturnType<typeof getRoles>>;
  }>;
}

export default function UsersTable({ promises }: UsersTableProps) {
  const { users, departments, roles } = use(promises);
  const { data, pageCount } = users;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<UserRow> | null>(null);

  const columns = useMemo(() => getColumns({ setRowAction }), [setRowAction]);

  const filterFields: DataTableFilterField<UserRow>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Filter by name...",
    },
    {
      id: "username",
      label: "Name",
      placeholder: "Filter by username",
    },
    {
      id: "email",
      label: "Email",
      placeholder: "Filter by email",
    },
    {
      id: "role",
      label: "Role",
      options: [{ label: "Admin", value: "administrator" }],
    },
  ];

  const enableAdvancedTable = false;

  const { table } = useDataTable<UserRow>({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: enableAdvancedTable,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow?.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <UsersTableToolbarActions
            table={table}
            onCreateUser={() => setIsCreateDialogOpen(true)}
          />
        </DataTableToolbar>
      </DataTable>

      <UpdateUserSheet
        roles={roles}
        departments={departments}
        open={rowAction?.type === "update"}
        onOpenChange={() => setRowAction(null)}
        data={rowAction?.row.original ?? null}
      />

      <DeleteUsersDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        users={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => {
          rowAction?.row.toggleSelected(false);
          setRowAction(null);
        }}
      />

      <UserDialog
        onSuccess={() => {}}
        roles={roles}
        departments={departments}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}
