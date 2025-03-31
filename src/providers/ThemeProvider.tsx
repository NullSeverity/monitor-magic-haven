import React, { createContext, useState, useContext, useEffect } from 'react';

interface Settings {
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
    document.documentElement.className = theme; // Set theme as class on html element
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('font', font);
    document.documentElement.style.fontFamily = font; // Set font as inline style
  }, [font]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  // Update the effect to manage robots meta tag
  useEffect(() => {
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
  }, [settings.allowIndexing]);

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
