"use client";

import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { changeUserPassword, getUsersForDropdown } from "../_lib/actions";
import { z } from "zod";

const passwordChangeSchema = z
  .object({
    userId: z.string().min(1, "Please select a user"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

type User = {
  id: number;
  name: string | null;
  username: string | null;
  email: string | null;
};

export function PasswordChangeForm() {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      userId: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const loadUsers = async () => {
      const result = await getUsersForDropdown();
      if (result.success) {
        setUsers(result.data);
      } else {
        toast.error("Failed to load users");
      }
      setIsLoadingUsers(false);
    };

    loadUsers();
  }, []);

  const onSubmit = (data: PasswordChangeFormData) => {
    startTransition(async () => {
      const result = await changeUserPassword({
        userId: parseInt(data.userId),
        newPassword: data.newPassword,
      });

      if (result.success) {
        toast.success("Password changed successfully");
        form.reset();
      } else {
        toast.error(result.error || "Failed to change password");
      }
    });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Change User Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingUsers
                              ? "Loading users..."
                              : "Select a user"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name || "No Name"} (
                          {user.username || "No Username"}) -{" "}
                          {user.email || "No Email"}
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isLoadingUsers}
            >
              {isPending ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
