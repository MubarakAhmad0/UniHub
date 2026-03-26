"use client";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

export function PasswordSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className={cn("flex flex-col gap-6")}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>
  );
}
