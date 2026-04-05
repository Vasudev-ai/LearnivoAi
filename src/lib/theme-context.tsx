"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { themes, ThemeName, defaultTheme, getThemeStorageKey, getColorModeStorageKey } from './theme-config';

type ColorMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeName;
  colorMode: ColorMode;
  setTheme: (theme: ThemeName) => void;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme);
  const [colorMode, setColorModeState] = useState<ColorMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const storedTheme = localStorage.getItem(getThemeStorageKey()) as ThemeName | null;
    const storedColorMode = localStorage.getItem(getColorModeStorageKey()) as ColorMode | null;
    
    if (storedTheme && themes[storedTheme]) {
      setThemeState(storedTheme);
    }
    
    if (storedColorMode) {
      setColorModeState(storedColorMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorModeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const themeColors = themes[theme].colors[colorMode];
    
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-color-mode', colorMode);
    
    root.style.setProperty('--primary', themeColors.primary);
    root.style.setProperty('--primary-foreground', themeColors.primaryForeground);
    root.style.setProperty('--accent', themeColors.accent);
    root.style.setProperty('--accent-foreground', themeColors.accentForeground);
    
    const assistantPrimary = theme === 'fresh' 
      ? themeColors.primary 
      : theme === 'teal'
        ? themeColors.primary
        : theme === 'forest'
          ? themeColors.primary
          : themeColors.primary;
    
    root.style.setProperty('--assistant-user-bubble', assistantPrimary);
    root.style.setProperty('--assistant-orb-bg', `radial-gradient(circle, hsl(${assistantPrimary} / 0.8), hsl(${assistantPrimary} / 0.5 / 0.9))`);
    
    if (colorMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem(getThemeStorageKey(), theme);
    localStorage.setItem(getColorModeStorageKey(), colorMode);
  }, [theme, colorMode, mounted]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorModeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const resolvedTheme = colorMode;

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, toggleColorMode, setColorMode, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
