import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/db/schema/auth";
import { DataTableRowAction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Edit, Shield, Trash2 } from "lucide-react";

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<
      Role & { permissionCount: number }
    > | null>
  >;
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<Role & { permissionCount: number }>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center w-10">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-10">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-1"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "key",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Key" />
      ),
      cell: ({ row }) => {
        const key = row.getValue("key") as string;
        return <div className="font-medium">{key}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return <div>{description || "—"}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "permissionCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Permissions" />
      ),
      cell: ({ row }) => {
        const permissionCount = row.getValue("permissionCount") as number;
        return <Badge variant="secondary">{permissionCount} permissions</Badge>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "update" })}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "permissions" })}
              >
                <Shield className="w-4 h-4 mr-2" />
                Manage Permissions
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "delete" })}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
