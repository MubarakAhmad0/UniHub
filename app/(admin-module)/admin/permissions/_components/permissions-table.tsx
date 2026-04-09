"use client";

import { use, useMemo, useState } from "react";
import { Permission } from "@/db/schema/auth";
import type {
  DataTableAdvancedFilterField,
  DataTableFilterField,
  DataTableRowAction,
} from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { getColumns } from "./get-columns";
import { getPermissions } from "../_lib/queries";
import { PermissionDialog } from "./permission-dialog";
import { PermissionRolesDialog } from "./permission-roles-dialog";
import { DeletePermissionsDialog } from "./delete-permissions-dialog";
import { PermissionsTableToolbarActions } from "./permissions-table-toolbar-actions";
import { useFeatureFlags } from "../../../../../components/data-table/feature-flags-provider";

export interface PermissionsTableProps {
  data: Promise<Awaited<ReturnType<typeof getPermissions>>>;
}

export function PermissionsTable({ data }: PermissionsTableProps) {
  const { featureFlags } = useFeatureFlags();
  const { data: permissionsData, pageCount } = use(data);

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<Permission> | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const columns = useMemo(() => getColumns({ setRowAction }), [setRowAction]);

  const filterFields: DataTableFilterField<Permission>[] = [
    {
      id: "resource",
      label: "Resource",
      placeholder: "Filter by resource...",
    },
    {
      id: "action",
      label: "Action",
      placeholder: "Filter by action...",
    },
  ];

  const advancedFilterFields: DataTableAdvancedFilterField<Permission>[] = [
    {
      id: "resource",
      label: "Resource",
      type: "text",
    },
    {
      id: "action",
      label: "Action",
      type: "text",
    },
  ];

  const enableAdvancedTable = featureFlags.includes("advancedTable");

  const { table } = useDataTable({
    data: permissionsData,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "resource", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable table={table}>
        {enableAdvancedTable ? (
          <DataTableAdvancedToolbar
            table={table}
            filterFields={advancedFilterFields}
            shallow={false}
          >
            <PermissionsTableToolbarActions
              table={table}
              onCreatePermission={() => setIsCreateDialogOpen(true)}
            />
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} filterFields={filterFields}>
            <PermissionsTableToolbarActions
              table={table}
              onCreatePermission={() => setIsCreateDialogOpen(true)}
            />
          </DataTableToolbar>
        )}
      </DataTable>

      <PermissionDialog
        permission={
          rowAction?.type === "update" ? rowAction.row.original : null
        }
        open={rowAction?.type === "update"}
        onOpenChange={(open) => !open && setRowAction(null)}
        onSuccess={() => setRowAction(null)}
      />

      <PermissionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => setIsCreateDialogOpen(false)}
      />

      <PermissionRolesDialog
        permission={
          rowAction?.type === "update" ? rowAction.row.original : null
        }
        open={rowAction?.type === "update"}
        onOpenChange={(open) => !open && setRowAction(null)}
        onSuccess={() => setRowAction(null)}
      />

      <DeletePermissionsDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        permissions={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
