"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPermission, updatePermission } from "../_lib/actions";
import { toast } from "sonner";
import {
  Resource,
  Action,
  resources,
  actions,
} from "@/lib/auth/access-control";
import { Permission } from "@/db/schema/auth";

interface PermissionDialogProps {
  permission?: Permission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (permission: Permission) => void;
}

export function PermissionDialog({
  permission,
  open,
  onOpenChange,
  onSuccess,
}: PermissionDialogProps) {
  const [description, setDescription] = useState(permission?.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResources, setSelectedResources] = useState<Resource[]>(
    permission ? [permission.resource as Resource] : [],
  );
  const [selectedActions, setSelectedActions] = useState<Action[]>(
    permission ? [permission?.action as Action] : [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedResources.length === 0 || selectedActions.length === 0) {
      toast.error("Please select at least one module and one action");
      return;
    }

    setIsLoading(true);
    try {
      const promises = [];

      if (permission) {
        // For editing, only allow one module and action
        const result = await updatePermission(permission.id, {
          resource: selectedResources[0],
          action: selectedActions[0],
          description: description.trim(),
        });
        promises.push(result);
      } else {
        // For creating, allow multiple combinations
        for (const resource of selectedResources) {
          for (const action of selectedActions) {
            promises.push(
              createPermission({
                description: description.trim(),
                resource: resource,
                action: action,
              }),
            );
          }
        }
      }

      const results = await Promise.all(promises);
      const failedResults = results.filter((result) => !result.success);

      if (failedResults.length === 0) {
        onOpenChange(false);
        toast.success(
          permission
            ? "Permission updated successfully"
            : `${results.length} permission(s) created successfully`,
        );

        // Reset form
        if (!permission) {
          setDescription("");
          setSelectedResources([]);
          setSelectedActions([]);
        }

        // Call onSuccess with the first permission for compatibility
        if (results[0].permission) {
          onSuccess(results[0].permission);
        }
      } else {
        toast.error(`Failed to create ${failedResults.length} permission(s)`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setDescription(permission?.description || "");
      if (!permission) {
        setSelectedResources([]);
        setSelectedActions([]);
      }
    }
    onOpenChange(newOpen);
  };

  const handleModuleChange = (resource: Resource, checked: boolean) => {
    if (checked) {
      setSelectedResources((prev) => [...prev, resource]);
    } else {
      setSelectedResources((prev) => prev.filter((m) => m !== resource));
    }
  };

  const handleActionChange = (action: Action, checked: boolean) => {
    if (checked) {
      setSelectedActions((prev) => [...prev, action]);
    } else {
      setSelectedActions((prev) => prev.filter((a) => a !== action));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {permission ? "Edit Permission" : "Create Permission"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter permission description"
              rows={3}
            />
          </div>
          <div>
            <Label>Modules</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {resources.map((moduleItem) => (
                <div key={moduleItem} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`module-${moduleItem}`}
                    checked={selectedResources.includes(moduleItem)}
                    onChange={(e) =>
                      handleModuleChange(moduleItem, e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor={`module-${moduleItem}`}
                    className="text-sm font-normal"
                  >
                    {moduleItem}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>Actions</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {actions.map((action) => (
                <div key={action} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`action-${action}`}
                    checked={selectedActions.includes(action)}
                    onChange={(e) =>
                      handleActionChange(action, e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor={`action-${action}`}
                    className="text-sm font-normal"
                  >
                    {action}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          {!permission &&
            selectedResources.length > 0 &&
            selectedActions.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Will create {selectedResources.length * selectedActions.length}{" "}
                permission(s)
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
            <Button
              type="submit"
              disabled={
                isLoading ||
                selectedResources.length === 0 ||
                selectedActions.length === 0
              }
            >
              {isLoading
                ? "Saving..."
                : permission
                  ? "Update"
                  : selectedResources.length > 0 && selectedActions.length > 0
                    ? `Create ${selectedResources.length * selectedActions.length}`
                    : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
