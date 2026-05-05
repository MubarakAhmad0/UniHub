"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-[#FF8157]/[0.06] backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <div className="flex flex-1 items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div>
              <Image
                src="/favicon.ico"
                alt="UniHub Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
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
            <Link href="/login">
              <Button className="rounded-full bg-[#FF8157] text-white hover:bg-[#E6744E] shadow-sm hover:shadow-md transition-all">
                Student Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
