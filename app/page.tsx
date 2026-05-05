import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { LandingNav } from "./_components/landing/landing-nav";
import { LandingHero } from "./_components/landing/landing-hero";
import { LandingPillars } from "./_components/landing/landing-pillars";
import { LandingAnnouncements } from "./_components/landing/landing-announcements";
import { LandingFooter } from "./_components/landing/landing-footer";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    redirect("/dashboard/announcements");
  }

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Toaster richColors />
      <LandingNav />
      <main className="flex-1">
        <LandingHero />
        <LandingPillars />
        <LandingAnnouncements />
      </main>
      <LandingFooter />
    </div>
  );
}
