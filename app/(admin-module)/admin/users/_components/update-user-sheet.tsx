"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Branch, Department } from "@/db/schema";
import { Role } from "@/db/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createUserAccount,
  getUserAccounts,
  updateUserWithRole,
} from "../_lib/actions";
import { UserFormData, userFormSchema } from "../_lib/validations";
import { UserRow } from "./users-table-columns";

type UpdateUserSheetProps = React.ComponentPropsWithRef<typeof Sheet> & {
  data: UserRow | null;
  roles: Role[];
  departments: Department[];
  branches: Branch[];
};

export default function UpdateUserSheet({
  data,
  roles,
  departments,
  branches,
  ...props
}: UpdateUserSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema.omit({ emailVerified: true })),
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
      username: data?.username ?? "",
      phoneNumber: data?.phoneNumber ?? "",
      jobTitle: data?.jobTitle ?? "",
      roleIds: data?.roles?.map((role) => role.id) ?? [],
      employeeId: data?.employeeId ?? "",
      departmentId: data?.departmentId ?? 0,
      branchId: data?.branchId ?? 0,
      isActive: data?.isActive ?? false,
      oldId: data?.oldId ?? undefined,
    },
  });

  const onSubmit = async (input: UserFormData) => {
    if (!data) return;

    startTransition(async () => {
      try {
        const result = await updateUserWithRole({
          id: data.id,
          ...input,
        });

        if (result && result.success) {
          toast.success("User updated successfully");
          form.reset();
          if (props.onOpenChange) {
            props.onOpenChange(false);
          }
        } else {
          toast.error(result?.error || "Failed to save user");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  const fetchAccounts = async () => {
    if (data?.id) {
      const result = await getUserAccounts(data.id);
      if (result.success) {
        setAccounts(result.data);
      }
    }
  };

  const handleCreateAccount = async () => {
    if (!data?.id || !newPassword) {
      toast.error("Please enter a password");
      return;
    }

    setIsCreatingAccount(true);
    try {
      const result = await createUserAccount({
        userId: data.id,
        password: newPassword,
      });

      if (result.success) {
        toast.success("Account created successfully");
        setNewPassword("");
        await fetchAccounts(); // Refresh accounts list
      } else {
        toast.error(result.error || "Failed to create account");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name ?? "",
        email: data.email ?? "",
        username: data.username ?? "",
        phoneNumber: data.phoneNumber ?? "",
        jobTitle: data.jobTitle ?? "",
        roleIds: data.roles?.map((role) => role.id) ?? [],
        employeeId: data.employeeId ?? "",
        departmentId: data.departmentId ?? 0,
        branchId: data.branchId ?? 0,
        isActive: data.isActive ?? false,
        oldId: data.oldId ?? 0,
      });

      fetchAccounts();
    }
  }, [data, form]);

  return (
    <Sheet {...props}>
      <SheetContent className="sm:max-w-lg flex flex-col h-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Update User</SheetTitle>
          <SheetDescription>
            Update the user details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              toast.error(JSON.stringify(errors));
            })}
            className="flex flex-col flex-1 gap-6"
          >
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-2">
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
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter email"
                          />
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
                          <Input {...field} placeholder="Enter phone number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
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
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter employee ID" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="roleIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roles</FormLabel>
                        <FormDescription>
                          Select one or more roles for this user
                        </FormDescription>
                        <div className="grid grid-cols-2 gap-2 overflow-y-auto">
                          {roles.map((role) => (
                            <div
                              key={role.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`role-${role.id}`}
                                checked={
                                  field.value?.includes(role.id) ?? false
                                }
                                onCheckedChange={(checked) => {
                                  const currentRoles = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentRoles, role.id]);
                                  } else {
                                    field.onChange(
                                      currentRoles.filter(
                                        (id) => id !== role.id,
                                      ),
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
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="branchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a branch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem
                                key={branch.id}
                                value={branch.id.toString()}
                              >
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="oldId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Old ID</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter Old ID"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel>Active</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Accounts Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">User Accounts</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAccounts()}
                      disabled={isPending}
                    >
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {accounts && accounts.length > 0 ? (
                      accounts.map((account, index) => (
                        <div
                          key={account.id || index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">
                              Provider: {account.providerId}
                            </div>
                            <div className="text-xs">
                              ID: {account.accountId}
                            </div>
                            {account.password && (
                              <div className="text-xs text-green-600">
                                Has Password
                              </div>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {account.providerId}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No accounts found
                      </div>
                    )}

                    {/* Create Account Section */}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="text-xs font-medium">
                        Create New Account
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder="Enter password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleCreateAccount}
                          disabled={isCreatingAccount || !newPassword}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {isCreatingAccount ? "Creating..." : "Create"}
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Provider will be set to &quot;credential&quot;
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-auto">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
