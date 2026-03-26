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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTransition } from "react";
import { changePassword } from "../_lib/actions";
import {
  passwordChangeSchema,
  type PasswordChangeData,
} from "../_lib/validations";

export function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  // const [isResetPending, startResetTransition] = useTransition();

  const form = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: PasswordChangeData) {
    startTransition(async () => {
      const result = await changePassword(data);

      if (result.success) {
        toast.success("Password changed successfully");
        form.reset();
      } else {
        toast.error(result.error || "Failed to change password");
      }
    });
  }

  // function handleSendResetEmail() {
  //   startResetTransition(async () => {
  //     const result = await sendPasswordResetEmail();

  //     if (result.success) {
  //       toast.success("Password reset email sent! Check your inbox.");
  //     } else {
  //       toast.error(result.error || "Failed to send reset email");
  //     }
  //   });
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your password or send yourself a reset email link.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
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
                      autoComplete="new-password"
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
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Changing..." : "Change Password"}
              </Button>

              {/* <Button 
                type="button" 
                variant="outline" 
                disabled={isResetPending}
                onClick={handleSendResetEmail}
              >
                {isResetPending ? "Sending..." : "Send Reset Email"}
              </Button> */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
