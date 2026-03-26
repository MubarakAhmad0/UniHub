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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createRole, updateRole } from "../_lib/actions";
import { toast } from "sonner";
import { Role } from "@/db/schema/auth";

interface RoleDialogProps {
  role?: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (role: Role) => void;
}

export function RoleDialog({
  role,
  open,
  onOpenChange,
  onSuccess,
}: RoleDialogProps) {
  const [name, setName] = useState(role?.key || "");
  const [description, setDescription] = useState(role?.description || "");
  const [key, setKey] = useState(role?.key || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      let result;
      if (role) {
        result = await updateRole(role.id, {
          key: key.trim().toLowerCase(),
          name: name.trim(),
          description: description.trim(),
        });
      } else {
        result = await createRole({
          key: key.trim().toLowerCase(),
          name: name.trim(),
          description: description.trim(),
        });
      }

      if (result.success && result.role) {
        onSuccess(result.role);
        onOpenChange(false);
        toast.success(
          role ? "Role updated successfully" : "Role created successfully",
        );

        // Reset form
        if (!role) {
          setName("");
          setDescription("");
        }
      } else {
        toast.error(result.error || "Failed to save role");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName(role?.name || "");
      setDescription(role?.description || "");
      setKey(role?.key || "");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
              required
            />
          </div>
          <div>
            <Label htmlFor="key">Key *</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter role name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter role description"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Saving..." : role ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
