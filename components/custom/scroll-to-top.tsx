"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg hover:shadow-md"
        onClick={scrollToTop}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg hover:shadow-md"
        onClick={scrollToBottom}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
