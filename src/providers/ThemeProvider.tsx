
import React, { createContext, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";

export interface Settings {
  theme: "light" | "dark" | "system";
  font: "inter" | "manrope" | "system";
  radius: "none" | "sm" | "md" | "lg";
  noIndex: boolean; // Add noIndex setting
}

interface ThemeContextType {
  settings: Settings;
  setTheme: (theme: Settings["theme"]) => void;
  setFont: (font: Settings["font"]) => void;
  setRadius: (radius: Settings["radius"]) => void;
  setNoIndex: (noIndex: boolean) => void; // Add setter for noIndex
  isDarkMode: boolean;
}

const defaultSettings: Settings = {
  theme: "system",
  font: "inter",
  radius: "md",
  noIndex: false, // Default: allow indexing
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage or default
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem("theme-settings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    document.documentElement.classList.contains("dark")
  );

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("theme-settings", JSON.stringify(settings));
  }, [settings]);

  // Handle theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (settings.theme === "dark") {
        document.documentElement.classList.add("dark");
        setIsDarkMode(true);
      } else if (settings.theme === "light") {
        document.documentElement.classList.remove("dark");
        setIsDarkMode(false);
      } else if (settings.theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          document.documentElement.classList.add("dark");
          setIsDarkMode(true);
        } else {
          document.documentElement.classList.remove("dark");
          setIsDarkMode(false);
        }
      }
    };

    handleThemeChange();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (settings.theme === "system") {
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark");
          setIsDarkMode(true);
        } else {
          document.documentElement.classList.remove("dark");
          setIsDarkMode(false);
        }
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [settings.theme]);

  // Handlers for updating settings
  const setTheme = (theme: Settings["theme"]) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setFont = (font: Settings["font"]) => {
    setSettings((prev) => ({ ...prev, font }));
  };

  const setRadius = (radius: Settings["radius"]) => {
    setSettings((prev) => ({ ...prev, radius }));
  };

  const setNoIndex = (noIndex: boolean) => {
    setSettings((prev) => ({ ...prev, noIndex }));
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        setTheme,
        setFont,
        setRadius,
        setNoIndex,
        isDarkMode,
      }}
    >
      <Helmet>
        {/* Font family */}
        <html
          className={`${settings.font === "inter" ? "font-inter" : ""} ${
            settings.font === "manrope" ? "font-manrope" : ""
          } ${settings.radius === "none" ? "radius-none" : ""} ${
            settings.radius === "sm" ? "radius-sm" : ""
          } ${settings.radius === "md" ? "radius-md" : ""} ${
            settings.radius === "lg" ? "radius-lg" : ""
          }`}
        />
        
        {/* Control indexing with robots meta tag */}
        {settings.noIndex && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </Helmet>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
