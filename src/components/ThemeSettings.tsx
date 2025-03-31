import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChromePicker } from 'react-color';
import { useTheme } from '@/providers/ThemeProvider';
import { Switch } from "@/components/ui/switch";

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
  };

  const handleFontChange = (value: string) => {
    setFont(value);
  };

  const handlePrimaryColorChange = (color: any) => {
    setSettings({
      ...settings,
      primaryColor: color.hex
    });
  };

  const handleSecondaryColorChange = (color: any) => {
    setSettings({
      ...settings,
      secondaryColor: color.hex
    });
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

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select value={theme} onValueChange={handleThemeChange}>
          <SelectTrigger id="theme">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            {/* Add more themes here */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font">Font</Label>
        <Select value={font} onValueChange={handleFontChange}>
          <SelectTrigger id="font">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inter">Inter</SelectItem>
            <SelectItem value="roboto">Roboto</SelectItem>
            <SelectItem value="poppins">Poppins</SelectItem>
            {/* Add more fonts here */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Primary Color</Label>
        <ChromePicker color={settings.primaryColor} onChange={handlePrimaryColorChange} />
      </div>

      <div className="space-y-4">
        <Label>Secondary Color</Label>
        <ChromePicker color={settings.secondaryColor} onChange={handleSecondaryColorChange} />
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
