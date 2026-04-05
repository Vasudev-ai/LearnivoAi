"use client";

import { themes, ThemeName } from "@/lib/theme-config";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const themeColors: Record<ThemeName, { light: string; dark: string }> = {
  fresh: { light: "#84CC16", dark: "#65A30D" },
  teal: { light: "#1A7A70", dark: "#0D7377" },
  forest: { light: "#059669", dark: "#047857" },
  indigo: { light: "#6366F1", dark: "#4F46E5" },
};

const themeBgLight: Record<ThemeName, { bg: string; card: string }> = {
  fresh: { bg: "#F8F6F2", card: "#FDFCFA" },
  teal: { bg: "#F8F6F2", card: "#FDFCFA" },
  forest: { bg: "#F8F6F2", card: "#FDFCFA" },
  indigo: { bg: "#F8F6F2", card: "#FDFCFA" },
};

const themeBgDark: Record<ThemeName, { bg: string; card: string }> = {
  fresh: { bg: "#0F0F0F", card: "#1A1A1A" },
  teal: { bg: "#0F1219", card: "#141921" },
  forest: { bg: "#0A0F0A", card: "#121A12" },
  indigo: { bg: "#0D0F1A", card: "#131525" },
};

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-4">
      {(Object.keys(themes) as ThemeName[]).map((themeKey) => {
        const themeConfig = themes[themeKey];
        const colors = themeColors[themeKey];
        const isSelected = theme === themeKey;

        return (
          <button
            key={themeKey}
            onClick={() => setTheme(themeKey)}
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
              isSelected 
                ? "border-primary ring-2 ring-primary/20" 
                : "border-border hover:border-primary/50"
            )}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <div 
                  className="h-10 w-14 rounded-lg border border-border/50 overflow-hidden"
                  style={{ backgroundColor: themeBgLight[themeKey].bg }}
                >
                  <div className="p-1.5 space-y-1">
                    <div className="h-2 rounded-full" style={{ backgroundColor: themeBgLight[themeKey].card }} />
                    <div className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: themeBgLight[themeKey].card }} />
                    <div 
                      className="h-3 w-6 rounded-md mt-1"
                      style={{ backgroundColor: colors.light }}
                    />
                  </div>
                </div>
                
                <div 
                  className="h-10 w-14 rounded-lg border border-white/10 overflow-hidden"
                  style={{ backgroundColor: themeBgDark[themeKey].bg }}
                >
                  <div className="p-1.5 space-y-1">
                    <div className="h-2 rounded-full" style={{ backgroundColor: themeBgDark[themeKey].card }} />
                    <div className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: themeBgDark[themeKey].card }} />
                    <div 
                      className="h-3 w-6 rounded-md mt-1"
                      style={{ backgroundColor: colors.dark }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-left">
                <p className="font-medium text-sm">{themeConfig.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {themeConfig.description}
                </p>
              </div>
              
              <div className="flex gap-1.5">
                <div 
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: colors.light }}
                />
                <div 
                  className="h-4 w-4 rounded-full border border-border/50"
                  style={{ backgroundColor: colors.dark }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
