"use client";

import * as React from "react";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
} from "@/components/credenza";
import EmailLogin from "../email-login";
import { GoogleSignInButton } from "../google-sign-in";
import { cn } from "@/lib/utils";

interface LoginModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
}

export function LoginModal({
  children,
  open,
  onOpenChange,
  triggerClassName,
}: LoginModalProps) {
  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      {children && (
        <CredenzaTrigger asChild>
          <div className={cn("inline-block cursor-pointer", triggerClassName)}>
            {children}
          </div>
        </CredenzaTrigger>
      )}
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle className="text-2xl font-bold text-center">
            Welcome back
          </CredenzaTitle>
          <CredenzaDescription className="text-center">
            Sign in to your UniHub student portal.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="pb-6 pt-4">
          <div className="grid gap-4">
            <EmailLogin />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <GoogleSignInButton />
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Contact your university administrator if you need an account.
          </p>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
