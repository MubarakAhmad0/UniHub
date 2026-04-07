import { Toaster } from "@/components/ui/sonner";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
import React from "react";
import { LandingNav } from "./_components/landing/landing-nav";
import { CampusScroll } from "@/components/campus-scroll";
import { LandingFeatures } from "./_components/landing/landing-features";
import { LandingFooter } from "./_components/landing/landing-footer";

export default async function LoginPage() {
  // const session = await auth.api.getSession({ headers: await headers() });

  // if (session?.user) {
  //   redirect("/dashboard");
  // }

  return (
    <div className="flex min-h-screen flex-col font-sans bg-white">
      <Toaster richColors />
      <LandingNav />
      <CampusScroll />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
}
