export type ThemeName = 'fresh' | 'teal' | 'forest' | 'indigo';

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
}

export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}

export const themes: Record<ThemeName, ThemeConfig> = {
  fresh: {
    name: 'Fresh',
    description: 'Lime green, energetic and youthful',
    colors: {
      light: {
        primary: '84 81% 44%',
        primaryForeground: '0 0% 98%',
        accent: '40 80% 55%',
        accentForeground: '220 15% 20%',
      },
      dark: {
        primary: '84 70% 55%',
        primaryForeground: '220 15% 10%',
        accent: '40 80% 55%',
        accentForeground: '40 20% 95%',
      },
    },
  },
  teal: {
    name: 'Teal',
    description: 'Deep teal, calm and professional',
    colors: {
      light: {
        primary: '174 55% 35%',
        primaryForeground: '0 0% 98%',
        accent: '40 80% 55%',
        accentForeground: '220 15% 20%',
      },
      dark: {
        primary: '174 50% 55%',
        primaryForeground: '220 20% 10%',
        accent: '40 80% 55%',
        accentForeground: '40 20% 95%',
      },
    },
  },
  forest: {
    name: 'Forest',
    description: 'Nature green, growth-oriented',
    colors: {
      light: {
        primary: '160 60% 35%',
        primaryForeground: '0 0% 98%',
        accent: '40 80% 55%',
        accentForeground: '220 15% 20%',
      },
      dark: {
        primary: '160 50% 50%',
        primaryForeground: '220 15% 10%',
        accent: '40 80% 55%',
        accentForeground: '40 20% 95%',
      },
    },
  },
  indigo: {
    name: 'Indigo',
    description: 'Deep blue, intellectual and premium',
    colors: {
      light: {
        primary: '239 84% 55%',
        primaryForeground: '0 0% 98%',
        accent: '40 80% 55%',
        accentForeground: '220 15% 20%',
      },
      dark: {
        primary: '239 65% 65%',
        primaryForeground: '220 15% 8%',
        accent: '40 80% 55%',
        accentForeground: '40 20% 95%',
      },
    },
  },
};

export const defaultTheme: ThemeName = 'fresh';

export function getThemeStorageKey() {
  return 'learnivo-theme';
}

export function getColorModeStorageKey() {
  return 'learnivo-color-mode';
}
