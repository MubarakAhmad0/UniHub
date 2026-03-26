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
  getPermissionWithRoles,
  assignRolesToPermission,
} from "../_lib/actions";
import { getRoles } from "../../roles/_lib/actions";
import { toast } from "sonner";
import { Permission } from "@/db/schema/auth";

interface PermissionRolesDialogProps {
  permission: Permission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type RoleItem = {
  id: number;
  key: string;
  description: string | null;
};

export function PermissionRolesDialog({
  permission,
  open,
  onOpenChange,
}: PermissionRolesDialogProps) {
  const [allRoles, setAllRoles] = useState<RoleItem[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && permission) {
      loadData();
    }
  }, [open, permission]);

  const loadData = async () => {
    if (!permission) return;

    setIsLoading(true);
    try {
      const [roles, permissionWithRoles] = await Promise.all([
        getRoles(),
        getPermissionWithRoles(permission.id),
      ]);

      setAllRoles(roles);

      if (permissionWithRoles) {
        const permissionRoleIds = new Set(
          permissionWithRoles.roles.map((r) => r.id),
        );
        setSelectedRoles(permissionRoleIds);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = (roleId: number) => {
    const newSelected = new Set(selectedRoles);
    if (newSelected.has(roleId)) {
      newSelected.delete(roleId);
    } else {
      newSelected.add(roleId);
    }
    setSelectedRoles(newSelected);
  };

  const handleSave = async () => {
    if (!permission) return;

    setIsSaving(true);
    try {
      const result = await assignRolesToPermission(
        permission.id,
        Array.from(selectedRoles),
      );

      if (result.success) {
        toast.success("Roles updated successfully");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update roles");
      }
    } catch (error) {
      console.error("Error saving roles:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (!permission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Manage Roles for &ldquo;
            {`${permission.resource}:${permission.action}`}&ldquo;
            <Badge variant="secondary" className="ml-2">
              {selectedRoles.size} selected
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-sm text-muted-foreground">
              Loading roles...
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4">
              {allRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.has(role.id)}
                    onCheckedChange={() => handleRoleToggle(role.id)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {role.key}
                    </Label>
                    {role.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {role.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {allRoles.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No roles available
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
