"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  getRoleWithPermissions,
  assignPermissionsToRole,
} from "../_lib/actions";
import { getPermissions } from "../../permissions/_lib/actions";
import { toast } from "sonner";
import { Role, Permission } from "@/db/schema/auth";

interface RolePermissionsDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RolePermissionsDialog({
  role,
  open,
  onOpenChange,
}: RolePermissionsDialogProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && role) {
      loadData();
    }
  }, [open, role]);

  const loadData = async () => {
    if (!role) return;

    setIsLoading(true);
    try {
      const [permissions, roleWithPermissions] = await Promise.all([
        getPermissions(),
        getRoleWithPermissions(role.id),
      ]);

      setAllPermissions(permissions);

      if (roleWithPermissions) {
        const rolePermissionIds = new Set(
          roleWithPermissions.permissions
            .map((p) => p?.id)
            .filter(Boolean) as number[],
        );
        setSelectedPermissions(rolePermissionIds);
      }
    } catch (error) {
      console.error("Error loading data:", { error });
      toast.error("Failed to load permissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  const handleSave = async () => {
    if (!role) return;

    setIsSaving(true);
    try {
      const result = await assignPermissionsToRole(
        role.id,
        Array.from(selectedPermissions),
      );

      if (result.success) {
        toast.success("Permissions updated successfully");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update permissions");
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Manage Permissions for &ldquo;{role.key}&ldquo;
            <Badge variant="secondary" className="ml-2">
              {selectedPermissions.size} selected
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-sm text-muted-foreground">
              Loading permissions...
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {allPermissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={selectedPermissions.has(permission.id)}
                    onCheckedChange={() =>
                      handlePermissionToggle(permission.id)
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`permission-${permission.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {`${permission.resource}:${permission.action}`}
                    </Label>
                    {permission.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {permission.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {allPermissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No permissions available
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
