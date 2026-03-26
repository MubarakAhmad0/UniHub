import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { users as usersSchema } from "@/db/schema";
import { accounts, roles as rolesSchema } from "@/db/schema/auth";
import { DataTableRowAction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import type { InferSelectModel } from "drizzle-orm";
import { Edit, Ellipsis, Trash2 } from "lucide-react";

type User = InferSelectModel<typeof usersSchema>;
type Role = InferSelectModel<typeof rolesSchema>;
type Accounts = InferSelectModel<typeof accounts>;

export type UserRow = User & {
  roleNames: string;
  accounts: Accounts[];
  roles: Role[];
};

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<UserRow> | null>
  >;
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<UserRow>[] {
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
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        return <div className="font-medium">{row.original?.id ?? "N/A"}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return <div className="font-medium">{row.original?.name ?? "N/A"}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        return <div>{row.original?.email ?? "N/A"}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Username" />
      ),
      cell: ({ row }) => {
        return <div>{row.original?.username ?? "N/A"}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone Number" />
      ),
      cell: ({ row }) => {
        return <div>{row.original?.phoneNumber ?? "N/A"}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "roles",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        if (!row.original.roles?.length) {
          return "N/A";
        }
        return (
          <div>
            {row.original.roles
              .map((role: Role) => role.name)
              .filter(Boolean)
              .join(", ")}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "oldId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Old ID" />
      ),
      cell: ({ row }) => {
        return <div>{row.original.oldId ?? "N/A"}</div>;
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "accounts",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Have Account" />
      ),
      cell: ({ row }) => {
        return <div>{row.original.accounts?.length > 0 ? "YES" : "NO"}</div>;
      },
      enableSorting: false,
      enableHiding: true,
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
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "delete" })}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
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
