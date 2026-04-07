"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginModal } from "./login-modal";
import { GraduationCap } from "lucide-react";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <div className="flex flex-1 items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="rounded-md bg-primary p-1.5 text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-[family-name:var(--font-sans)] text-lg font-bold tracking-tight">
              UniHub
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#announcements"
              className="hover:text-foreground transition-colors"
            >
              Updates
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex rounded-full"
            >
              Request Demo
            </Button>
            <LoginModal>
              <Button className="rounded-full bg-[#FF8157] text-white hover:bg-[#E6744E] shadow-sm hover:shadow-md transition-all">
                Student Login
              </Button>
            </LoginModal>
          </div>
        </div>
      </div>
    </header>
  );
}
