
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChromePicker } from 'react-color';
import { useTheme, Settings } from '@/providers/ThemeProvider';
import { Switch } from "@/components/ui/switch";
import { themeConfigurations, fontOptions } from '@/themes/themeConfigs';
import { Card, CardContent } from "@/components/ui/card";

interface ThemeSettingsProps {
  className?: string;
}

const ThemeSettings = () => {
  const { theme, setTheme, font, setFont, settings, setSettings } = useTheme();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      appTitle: e.target.value
    });
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    
    // Also update the settings object
    setSettings({
      ...settings,
      theme: value
    });
    
    // Update font to recommended font for the theme
    if (value in themeConfigurations) {
      const recommendedFont = themeConfigurations[value as keyof typeof themeConfigurations].fonts.recommended;
      setFont(recommendedFont);
      // Fix: Convert the callback to a direct object update
      const updatedSettings = {
        ...settings,
        font: recommendedFont
      };
      setSettings(updatedSettings);
    }
  };

  const handleFontChange = (value: string) => {
    setFont(value);
    setSettings({
      ...settings,
      font: value
    });
  };

  const handlePrimaryColorChange = (color: any) => {
    setSettings({
      ...settings,
      primaryColor: color.hex
    });
    document.documentElement.style.setProperty('--primary', color.hex);
  };

  const handleSecondaryColorChange = (color: any) => {
    setSettings({
      ...settings,
      secondaryColor: color.hex
    });
    document.documentElement.style.setProperty('--secondary', color.hex);
  };

  const handleAllowIndexingChange = (checked: boolean) => {
    setSettings({
      ...settings,
      allowIndexing: checked
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application
        </p>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="title">App Title</Label>
        <Input id="title" placeholder="Enter app title" value={settings.appTitle} onChange={handleTitleChange} />
      </div>

      <div className="space-y-4">
        <Label htmlFor="theme">Theme</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {Object.entries(themeConfigurations).map(([key, config]) => (
            <Card 
              key={key} 
              className={`cursor-pointer overflow-hidden transition-all duration-200 ${theme === key ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleThemeChange(key)}
            >
              <div className={`h-24 ${config.preview}`}></div>
              <CardContent className="p-3">
                <h4 className="font-medium">{config.name}</h4>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Select value={theme} onValueChange={handleThemeChange}>
          <SelectTrigger id="theme">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(themeConfigurations).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="font">Font</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {Object.entries(fontOptions).map(([key, config]) => (
            <Card 
              key={key} 
              className={`cursor-pointer overflow-hidden transition-all duration-200 ${font === key ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleFontChange(key)}
              style={{ fontFamily: config.family }}
            >
              <CardContent className="p-3">
                <h4 className="font-medium">{config.name}</h4>
                <p className="text-xs text-muted-foreground">{config.description}</p>
                <div className="mt-2 text-sm">
                  The quick brown fox jumps over the lazy dog.
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Select value={font} onValueChange={handleFontChange}>
          <SelectTrigger id="font">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(fontOptions).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Primary Color</Label>
        <ChromePicker color={settings.primaryColor} onChange={handlePrimaryColorChange} disableAlpha />
      </div>

      <div className="space-y-4">
        <Label>Secondary Color</Label>
        <ChromePicker color={settings.secondaryColor} onChange={handleSecondaryColorChange} disableAlpha />
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Search Engine Visibility</h4>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Allow Search Indexing</div>
            <div className="text-xs text-muted-foreground">
              Allow search engines like Google to index your site
            </div>
          </div>
          <Switch 
            checked={settings.allowIndexing}
            onCheckedChange={handleAllowIndexingChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
