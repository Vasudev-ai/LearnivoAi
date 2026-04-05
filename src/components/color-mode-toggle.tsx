"use client";

import { useTheme } from "@/lib/theme-context";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ColorModeToggle({ className }: { className?: string }) {
  const { colorMode, toggleColorMode } = useTheme();

  return (
    <button
      onClick={toggleColorMode}
      className={cn(
        "relative h-9 w-9 rounded-lg flex items-center justify-center transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      aria-label={colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-300",
          colorMode === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          colorMode === "light" ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />
    </button>
  );
}
