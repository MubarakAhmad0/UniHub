import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import EmailLogin from "./_components/email-login";
import { GoogleSignInButton } from "./_components/google-sign-in";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Toaster richColors />

      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium">
              {/* Replace with your app logo */}
              <span className="font-bold">MyApp</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <div className={cn("flex flex-col gap-6")}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome to MyApp</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Sign in to your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <EmailLogin />
                  <div className="grid gap-3">
                    <GoogleSignInButton />
                  </div>
                </div>
                <div className="text-center text-sm">
                  Contact administrator for account creation
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <Image
            src="/login.jpg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5]"
            width={1920}
            height={1080}
            quality={100}
            priority
          />
        </div>
      </div>
    </>
  );
}
