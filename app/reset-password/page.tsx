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
import { Suspense, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import * as z from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(5, "Password must be at least 5 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const token = searchParams.get("token");

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: ResetPasswordData) {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    startTransition(async () => {
      try {
        const { error } = await authClient.resetPassword({
          newPassword: data.password,
          token,
        });

        if (error) {
          toast.error(error.message || "Failed to reset password");
        } else {
          toast.success("Password reset successfully! You can now sign in.");
          router.push("/sign-in");
        }
      } catch (error) {
        toast.error("Failed to reset password");
      }
    });
  }

  return (
    <div className="container mx-auto py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
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
                    <FormLabel>Confirm New Password</FormLabel>
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

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();

  return (
    <Suspense>
      <div className="container mx-auto py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Invalid Reset Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Button className="mt-4" onClick={() => router.push("/sign-in")}>
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
      <ResetPasswordForm />
    </Suspense>
  );
}
