"use client";

import { Role } from "@/db/schema/auth";
import type {
  DataTableAdvancedFilterField,
  DataTableFilterField,
  DataTableRowAction,
} from "@/types";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";

import { useFeatureFlags } from "../../../../../components/data-table/feature-flags-provider";
import { DeleteRolesDialog } from "./delete-roles-dialog";
import { RoleDialog } from "./role-dialog";
import { RolePermissionsDialog } from "./role-permissions-dialog";
import { getColumns } from "./roles-table-columns";
import { RolesTableFloatingBar } from "./roles-table-floating-bar";
import { RolesTableToolbarActions } from "./roles-table-toolbar-actions";
import { getRoles } from "../_lib/queries";

interface RolesTableProps {
  promises: Promise<Awaited<ReturnType<typeof getRoles>>>;
}

export function RolesTable({ promises }: RolesTableProps) {
  const { featureFlags } = useFeatureFlags();

  const { data, pageCount } = React.use(promises);

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<
    Role & { permissionCount: number }
  > | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const columns = React.useMemo(
    () => getColumns({ setRowAction }),
    [setRowAction],
  );

  const filterFields: DataTableFilterField<
    Role & { permissionCount: number }
  >[] = [
    {
      id: "key",
      label: "Role Key",
      placeholder: "Filter role key...",
    },
  ];

  const advancedFilterFields: DataTableAdvancedFilterField<
    Role & { permissionCount: number }
  >[] = [
    {
      id: "key",
      label: "Role Key",
      type: "text",
    },
    {
      id: "description",
      label: "Description",
      type: "text",
    },
  ];

  const enableAdvancedTable = featureFlags.includes("advancedTable");
  const enableFloatingBar = featureFlags.includes("floatingBar");

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: enableAdvancedTable,
    initialState: {
      sorting: [{ id: "key", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        floatingBar={
          enableFloatingBar ? <RolesTableFloatingBar table={table} /> : null
        }
      >
        {enableAdvancedTable ? (
          <DataTableAdvancedToolbar
            table={table}
            filterFields={advancedFilterFields}
            shallow={false}
          >
            <RolesTableToolbarActions
              table={table}
              onCreateRole={() => setIsCreateDialogOpen(true)}
            />
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} filterFields={filterFields}>
            <RolesTableToolbarActions
              table={table}
              onCreateRole={() => setIsCreateDialogOpen(true)}
            />
          </DataTableToolbar>
        )}
      </DataTable>

      <RoleDialog
        role={rowAction?.type === "update" ? rowAction.row.original : null}
        open={rowAction?.type === "update"}
        onOpenChange={(open) => !open && setRowAction(null)}
        onSuccess={() => setRowAction(null)}
      />

      <RoleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => setIsCreateDialogOpen(false)}
      />

      <RolePermissionsDialog
        role={rowAction?.type === "permissions" ? rowAction.row.original : null}
        open={rowAction?.type === "permissions"}
        onOpenChange={(open) => !open && setRowAction(null)}
      />

      <DeleteRolesDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        roles={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
