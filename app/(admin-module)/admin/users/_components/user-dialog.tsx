"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription } from "@/components/ui/form";
import { departments, users } from "@/db/schema";
import { Role } from "@/db/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { InferSelectModel } from "drizzle-orm";
import { createUserWithRole } from "../_lib/actions";
import { UserFormData, userFormSchema } from "../_lib/validations";

type User = InferSelectModel<typeof users>;
type Department = InferSelectModel<typeof departments>;

interface UserDialogProps {
  user?: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: User) => void;
  roles: Role[];
  departments: Department[];
}

export function UserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
  roles,
  departments,
}: UserDialogProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema.omit({ emailVerified: true })),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      phoneNumber: "",
      jobTitle: "",
      roleIds: [],
      departmentId: undefined,
      isActive: false,
    },
  });

  const onSubmit = async (input: UserFormData) => {
    try {
      const result = await createUserWithRole({
        ...input,
        id: user?.id ?? 0,
        roleIds: input.roleIds,
      });

      if (result && result.success) {
        toast.success(
          user ? "User updated successfully" : "User created successfully",
        );
        onOpenChange(false);
        if (!user) {
          form.reset();
        }
      } else {
        toast.error(result?.error || "Failed to save user");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              toast.error(JSON.stringify(errors));
            })}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter phone number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter job title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Select
                      value={field?.value?.toString()}
                      onValueChange={(value) =>
                        field.onChange(value ? parseInt(value) : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem
                            key={department.id}
                            value={department.id.toString()}
                          >
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleIds"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Roles</FormLabel>
                  <FormDescription>
                    Select one or more roles for this user
                  </FormDescription>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={field.value?.includes(role.id) ?? false}
                          onCheckedChange={(checked) => {
                            const currentRoles = field.value || [];
                            if (checked) {
                              field.onChange([...currentRoles, role.id]);
                            } else {
                              field.onChange(
                                currentRoles.filter((id) => id !== role.id),
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`role-${role.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {role.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Saving..."
                  : user
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
