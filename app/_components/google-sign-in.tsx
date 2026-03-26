"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth/auth-client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await signIn.social({ provider: "google" });
    setIsLoading(false);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleClick}
    >
      {isLoading ? <Spinner /> : <FcGoogle className="h-5 w-5" />}
      Login with Google
    </Button>
  );
}
