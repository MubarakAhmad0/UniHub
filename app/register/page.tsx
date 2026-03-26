import Image from "next/image";
import React from "react";
import EmailSignUp from "./_components/email-sign-up";
import { getRoles } from "../(admin-module)/admin/roles/_lib/actions";
import Link from "next/link";

export default async function Register() {
  const roles = await getRoles();

  return (
    <div className="grid min-h-svh lg:grid-cols-2 px-4 lg:px-0">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/placeholder-icon.jpg"
              alt="Placeholder Logo"
              width={24}
              height={24}
              className="rounded-md"
            />
            Placeholder
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Welcome to Placeholder</h1>
          
            </div>
            <div className="grid gap-6">
              <EmailSignUp roles={roles} />
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
  );
}
