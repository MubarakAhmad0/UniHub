"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { registerUser } from "../_lib/actions";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/db/schema/auth";

const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(5, { message: "Please confirm your password." }),
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." }),
    phoneNumber: z.string().min(1, { message: "Phone number is required." }),
    role: z.string().min(1, { message: "Role is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function EmailSignUp({ roles }: { roles: Role[] }) {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    phoneNumber: "",
    role: "florist",
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit() {
    const formData = new FormData();
    formData.append("email", form.getValues("email"));
    formData.append("password", form.getValues("password"));
    formData.append("confirmPassword", form.getValues("confirmPassword"));
    formData.append("username", form.getValues("username"));
    formData.append("phoneNumber", form.getValues("phoneNumber"));

    const result = await registerUser(formData);

    if (result?.error) {
      setGeneralError(result.error);
    } else {
      router.push("/");
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" autoComplete="email" />
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
                <Input {...field} autoComplete="username" type="text" />
              </FormControl>
              <FormDescription>For username login</FormDescription>
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
                <Input {...field} type="tel" autoComplete="tel" />
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
                <Input {...field} type="password" autoComplete="new-password" />
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
                <Input {...field} type="password" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles
                      .filter(
                        (role) => role.key !== "admin" && role.key !== "driver",
                      )
                      .map((role) => (
                        <SelectItem key={role.id} value={role.key}>
                          {role.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full mt-4" disabled={!form.formState.isValid}>
          {form.formState.isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Register"
          )}
        </Button>
        {generalError && (
          <div className="text-red-600 text-center text-sm mt-2">
            {generalError}
          </div>
        )}
      </form>
    </Form>
  );
}
