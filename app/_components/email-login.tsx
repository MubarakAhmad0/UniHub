"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useTransition } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getUserRolesNoCache } from "../_lib/action";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export default function EmailLogin() {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      try {
        await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
          fetchOptions: {
            onError: (error) => {
              console.log(error);
              toast.error(error.error.message ?? "Login failed");
            },
            onSuccess: async (data) => {
              const roles = await getUserRolesNoCache(data.data.user.id);
              if (!roles.includes("florist")) {
                router.push("/florist");
              }

              router.push("/dashboard");
              toast.success("Login successful", {
                description: "Redirecting to dashboard...",
              });
            },
          },
        });
      } catch (error) {
        toast.error("Login failed");
      }
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          Login
        </Button>
      </form>
    </Form>
  );
}
