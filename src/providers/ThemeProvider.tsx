
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeOption = 'default' | 'minimalist' | 'modern' | 'mechanical' | 'cyberpunk';
export type FontOption = 'inter' | 'poppins' | 'roboto-mono' | 'space-grotesk' | 'jetbrains-mono';

interface ThemeSettings {
  theme: ThemeOption;
  font: FontOption;
  appTitle: string;
  monitorNamePrefix: string;
  primaryColor: string;
  secondaryColor: string;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (settings: Partial<ThemeSettings>) => void;
  resetToDefaults: () => void;
}

const defaultSettings: ThemeSettings = {
  theme: 'default',
  font: 'inter',
  appTitle: 'Uptime Monitor',
  monitorNamePrefix: 'Monitor',
  primaryColor: 'hsl(222.2, 47.4%, 11.2%)',
  secondaryColor: 'hsl(210, 40%, 96.1%)'
};

const ThemeContext = createContext<ThemeContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetToDefaults: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);

  useEffect(() => {
    // Load saved theme settings from localStorage
    const savedSettings = localStorage.getItem('themeSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Apply theme settings when they change
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-font', settings.font);
    
    // Apply primary and secondary colors as CSS variables
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    
    // Save settings to localStorage
    localStorage.setItem('themeSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, resetToDefaults }}>
      {children}
    </ThemeContext.Provider>
  );
};
