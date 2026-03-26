"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark =
    theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    </div>
  );
}
