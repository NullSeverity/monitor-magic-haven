
import React, { createContext, useState, useContext, useEffect } from 'react';
import { themeConfigurations } from '@/themes/themeConfigs';

// Add these type exports
export type ThemeOption = 'default' | 'minimalist' | 'modern' | 'mechanical' | 'cyberpunk';
export type FontOption = 'inter' | 'poppins' | 'roboto-mono' | 'space-grotesk' | 'jetbrains-mono';

// Export the Settings interface
export interface Settings {
  theme: string;
  font: string;
  appTitle: string;
  primaryColor: string;
  secondaryColor: string;
  allowIndexing: boolean; // New setting for controlling indexing
}

interface ThemeContextProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  theme: string;
  setTheme: (theme: string) => void;
  font: string;
  setFont: (font: string) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('default');
  const [font, setFont] = useState('inter');

  // Initialize settings with a default allowIndexing value
  const [settings, setSettings] = useState<Settings>({
    theme: 'default',
    font: 'inter',
    appTitle: 'Uptime Monitor',
    primaryColor: 'blue',
    secondaryColor: 'green',
    allowIndexing: true, // Default to allow indexing
  });

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDarkMode);

    const storedTheme = localStorage.getItem('theme') || 'default';
    setTheme(storedTheme);

    const storedFont = localStorage.getItem('font') || 'inter';
    setFont(storedFont);

    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Remove all theme classes first
    const themeOptions: ThemeOption[] = ['default', 'minimalist', 'modern', 'mechanical', 'cyberpunk'];
    themeOptions.forEach(t => {
      document.documentElement.classList.remove(t);
    });
    
    // Add current theme as class
    document.documentElement.classList.add(theme);
    
    // Apply theme colors from configuration
    if (theme in themeConfigurations) {
      const config = themeConfigurations[theme as ThemeOption];
      
      // Apply CSS Variables
      const root = document.documentElement;
      
      // Set colors from the theme configuration
      root.style.setProperty('--background', config.colors.background);
      root.style.setProperty('--foreground', config.colors.foreground);
      root.style.setProperty('--card', config.colors.card);
      root.style.setProperty('--card-foreground', config.colors.cardForeground);
      root.style.setProperty('--muted', config.colors.muted);
      root.style.setProperty('--muted-foreground', config.colors.mutedForeground);
      root.style.setProperty('--accent', config.colors.accent);
      root.style.setProperty('--accent-foreground', config.colors.accentForeground);
      root.style.setProperty('--sidebar-background', config.colors.sidebar);
      root.style.setProperty('--sidebar-foreground', config.colors.sidebarForeground);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('font', font);
    document.documentElement.style.fontFamily = font;
    
    // Apply font family from configuration
    document.body.className = '';
    document.body.classList.add(`font-${font}`);
  }, [font]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // Handle the robots meta tag for indexing control
    let robotsMetaTag = document.querySelector('meta[name="robots"]');
    
    if (!robotsMetaTag) {
      robotsMetaTag = document.createElement('meta');
      robotsMetaTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsMetaTag);
    }
    
    if (settings.allowIndexing) {
      robotsMetaTag.setAttribute('content', 'index, follow');
    } else {
      robotsMetaTag.setAttribute('content', 'noindex, nofollow');
    }
    
    // Apply custom colors from settings
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
    }
    
    if (settings.secondaryColor) {
      document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
    }
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, theme, setTheme, font, setFont, settings, setSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
