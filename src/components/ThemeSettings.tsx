
import React from "react";
import { Settings, useTheme } from "@/providers/ThemeProvider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Monitor, Globe, EyeOff } from "lucide-react";

const ThemeSettings: React.FC = () => {
  const { settings, setTheme, setFont, setRadius, setNoIndex, isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="theme">Theme Mode</Label>
          <Select
            value={settings.theme}
            onValueChange={(value) => setTheme(value as Settings["theme"])}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center">
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center">
                  <Monitor className="w-4 h-4 mr-2" />
                  System
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="font">Font Family</Label>
          <Select
            value={settings.font}
            onValueChange={(value) => setFont(value as Settings["font"])}
          >
            <SelectTrigger id="font">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="manrope">Manrope</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="radius">Border Radius</Label>
          <Select
            value={settings.radius}
            onValueChange={(value) => setRadius(value as Settings["radius"])}
          >
            <SelectTrigger id="radius">
              <SelectValue placeholder="Select border radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* No Index Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="noindex" className="flex items-center gap-2">
              <EyeOff className="w-4 h-4" />
              Prevent Google Indexing
            </Label>
            <p className="text-sm text-muted-foreground">
              Add noindex meta tag to prevent search engines from indexing your site
            </p>
          </div>
          <Switch 
            id="noindex" 
            checked={settings.noIndex}
            onCheckedChange={setNoIndex}
          />
        </div>
        
        {settings.noIndex && (
          <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Globe className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">No-Index Mode Active</h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    Your site is currently not being indexed by search engines. This is useful for 
                    development or testing environments, but should be disabled for production sites 
                    that need to be discovered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSettings;
