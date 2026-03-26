"use client";

import { signIn } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function GoogleSignInButton() {
  return (
    <Button
      onClick={async () => {
        await signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
        });
      }}
      className="w-full flex items-center justify-center gap-2 bg-card text-card-foreground border border-border hover:bg-muted hover:text-foreground"
    >
      <FcGoogle className="h-5 w-5" />
      Sign in with Google
    </Button>
  );
}
