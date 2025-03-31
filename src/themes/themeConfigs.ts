
import { ThemeOption, FontOption } from '@/providers/ThemeProvider';

export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    sidebar: string;
    sidebarForeground: string;
  };
  fonts: {
    recommended: FontOption;
    alternates: FontOption[];
  };
  preview: string; // CSS class for preview
}

export const themeConfigurations: Record<ThemeOption, ThemeConfig> = {
  default: {
    name: 'Default',
    description: 'The standard monitor dashboard with balanced colors and readability',
    colors: {
      primary: 'hsl(222.2, 47.4%, 11.2%)',
      secondary: 'hsl(210, 40%, 96.1%)',
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(222.2, 84%, 4.9%)',
      card: 'hsl(0, 0%, 100%)',
      cardForeground: 'hsl(222.2, 84%, 4.9%)',
      muted: 'hsl(210, 40%, 96.1%)',
      mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',
      accent: 'hsl(210, 40%, 96.1%)',
      accentForeground: 'hsl(222.2, 47.4%, 11.2%)',
      sidebar: 'hsl(0, 0%, 98%)',
      sidebarForeground: 'hsl(240, 5.3%, 26.1%)'
    },
    fonts: {
      recommended: 'inter',
      alternates: ['poppins', 'roboto-mono']
    },
    preview: 'bg-white border border-gray-200 rounded-md shadow'
  },
  minimalist: {
    name: 'Minimalist',
    description: 'Clean and simple design with plenty of white space and subtle accents',
    colors: {
      primary: 'hsl(220, 14%, 20%)',
      secondary: 'hsl(220, 14%, 95%)',
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(220, 14%, 10%)',
      card: 'hsl(0, 0%, 100%)',
      cardForeground: 'hsl(220, 14%, 10%)',
      muted: 'hsl(220, 14%, 97%)',
      mutedForeground: 'hsl(220, 14%, 60%)',
      accent: 'hsl(220, 14%, 92%)',
      accentForeground: 'hsl(220, 14%, 20%)',
      sidebar: 'hsl(0, 0%, 100%)',
      sidebarForeground: 'hsl(220, 14%, 20%)'
    },
    fonts: {
      recommended: 'inter',
      alternates: ['poppins', 'roboto-mono']
    },
    preview: 'bg-white border border-gray-100 rounded-lg shadow-sm'
  },
  modern: {
    name: 'Modern',
    description: 'Bold colors and contemporary styling for a fresh look',
    colors: {
      primary: 'hsl(230, 60%, 50%)',
      secondary: 'hsl(230, 60%, 95%)',
      background: 'hsl(230, 30%, 99%)',
      foreground: 'hsl(230, 60%, 15%)',
      card: 'hsl(0, 0%, 100%)',
      cardForeground: 'hsl(230, 60%, 15%)',
      muted: 'hsl(230, 40%, 96%)',
      mutedForeground: 'hsl(230, 15%, 50%)',
      accent: 'hsl(230, 60%, 90%)',
      accentForeground: 'hsl(230, 60%, 30%)',
      sidebar: 'hsl(230, 60%, 50%)',
      sidebarForeground: 'hsl(0, 0%, 100%)'
    },
    fonts: {
      recommended: 'poppins',
      alternates: ['inter', 'space-grotesk']
    },
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg shadow'
  },
  mechanical: {
    name: 'Mechanical',
    description: 'Industrial design with structured layouts and technical aesthetics',
    colors: {
      primary: 'hsl(200, 9%, 25%)',
      secondary: 'hsl(200, 9%, 92%)',
      background: 'hsl(0, 0%, 97%)',
      foreground: 'hsl(200, 9%, 15%)',
      card: 'hsl(0, 0%, 100%)',
      cardForeground: 'hsl(200, 9%, 15%)',
      muted: 'hsl(200, 9%, 90%)',
      mutedForeground: 'hsl(200, 9%, 40%)',
      accent: 'hsl(25, 80%, 50%)',
      accentForeground: 'hsl(0, 0%, 100%)',
      sidebar: 'hsl(200, 9%, 15%)',
      sidebarForeground: 'hsl(0, 0%, 90%)'
    },
    fonts: {
      recommended: 'roboto-mono',
      alternates: ['jetbrains-mono', 'inter']
    },
    preview: 'bg-gray-100 border-2 border-gray-300 rounded shadow'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Futuristic neon aesthetics with high contrast and vivid colors',
    colors: {
      primary: 'hsl(320, 100%, 60%)',
      secondary: 'hsl(175, 100%, 45%)',
      background: 'hsl(230, 20%, 10%)',
      foreground: 'hsl(175, 100%, 95%)',
      card: 'hsl(230, 20%, 15%)',
      cardForeground: 'hsl(175, 100%, 95%)',
      muted: 'hsl(230, 20%, 20%)',
      mutedForeground: 'hsl(175, 50%, 70%)',
      accent: 'hsl(265, 100%, 60%)',
      accentForeground: 'hsl(0, 0%, 100%)',
      sidebar: 'hsl(265, 50%, 20%)',
      sidebarForeground: 'hsl(175, 100%, 90%)'
    },
    fonts: {
      recommended: 'space-grotesk',
      alternates: ['jetbrains-mono', 'roboto-mono']
    },
    preview: 'bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-500 rounded-md shadow-lg'
  }
};

export const fontOptions: Record<FontOption, { name: string; description: string; family: string }> = {
  'inter': {
    name: 'Inter',
    description: 'Clean, modern sans-serif for excellent readability',
    family: 'Inter, sans-serif'
  },
  'poppins': {
    name: 'Poppins',
    description: 'Geometric sans-serif with a friendly appearance',
    family: 'Poppins, sans-serif'
  },
  'roboto-mono': {
    name: 'Roboto Mono',
    description: 'Monospaced font with excellent technical clarity',
    family: 'Roboto Mono, monospace'
  },
  'space-grotesk': {
    name: 'Space Grotesk',
    description: 'Modern geometric sans with technological feel',
    family: 'Space Grotesk, sans-serif'
  },
  'jetbrains-mono': {
    name: 'JetBrains Mono',
    description: 'Developer-focused monospace with distinctive characters',
    family: 'JetBrains Mono, monospace'
  }
};
