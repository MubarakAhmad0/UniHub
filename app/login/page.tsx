import Image from "next/image";
import React from "react";
import EmailLogin from "@/app/_components/email-login";
import { GoogleSignInButton } from "@/app/_components/google-sign-in";
import Link from "next/link";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

export default async function Login() {
  // const session = await auth.api.getSession({ headers: await headers() });

  // if (session?.user) {
  //   redirect("/dashboard");
  // }

  return (
    <div className="grid min-h-svh lg:grid-cols-2 px-4 lg:px-0">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/favicon.ico"
              alt="UniHub Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            UniHub
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">
                Sign in to your UniHub student portal.
              </p>
            </div>
            <div className="grid gap-6">
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
              <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm">
                <p className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                  Test Credentials (Will be Removed in Production)
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Email:</span>{" "}
                  zq7.vortexpine88@orbitalmail.net
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Password:</span> R7!kL9@qZ2#x
                </p>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Contact your university administrator if you need an account.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/login.png"
          alt="UniHub Student Portal"
          className="absolute inset-0 w-full object-contain dark:brightness-[0.5]"
          width={1920}
          height={1080}
          quality={100}
          priority
        />
      </div>
    </div>
  );
}
