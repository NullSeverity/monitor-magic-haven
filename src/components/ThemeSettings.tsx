
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme, ThemeOption, FontOption } from '@/providers/ThemeProvider';
import { themeConfigurations, fontOptions } from '@/themes/themeConfigs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, RefreshCw } from "lucide-react";

const ThemeSettings: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useTheme();
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor);

  const handleThemeChange = (theme: ThemeOption) => {
    const themeConfig = themeConfigurations[theme];
    updateSettings({ 
      theme,
      primaryColor: themeConfig.colors.primary,
      secondaryColor: themeConfig.colors.secondary
    });
    setPrimaryColor(themeConfig.colors.primary);
    setSecondaryColor(themeConfig.colors.secondary);
  };

  const handleColorApply = () => {
    updateSettings({ primaryColor, secondaryColor });
  };

  return (
    <Tabs defaultValue="themes" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="themes">Themes</TabsTrigger>
        <TabsTrigger value="fonts">Fonts</TabsTrigger>
        <TabsTrigger value="titles">Text & Titles</TabsTrigger>
        <TabsTrigger value="colors">Colors</TabsTrigger>
      </TabsList>
      
      <TabsContent value="themes" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(themeConfigurations).map(([themeKey, theme]) => (
            <Card 
              key={themeKey}
              className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                settings.theme === themeKey ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleThemeChange(themeKey as ThemeOption)}
            >
              <div className={`h-24 w-full ${theme.preview}`} />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{theme.name}</h3>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                  </div>
                  {settings.theme === themeKey && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="fonts" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fontSelector">Select Font</Label>
            <Select 
              value={settings.font} 
              onValueChange={(value) => updateSettings({ font: value as FontOption })}
            >
              <SelectTrigger id="fontSelector">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(fontOptions).map(([fontKey, font]) => (
                  <SelectItem key={fontKey} value={fontKey}>
                    <div className="flex flex-col">
                      <span style={{ fontFamily: font.family }}>{font.name}</span>
                      <span className="text-xs text-muted-foreground">{font.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-4 rounded-md border mt-4">
            <h3 className="font-medium mb-2">Font Preview</h3>
            <div style={{ fontFamily: fontOptions[settings.font].family }}>
              <p className="text-2xl mb-2">The quick brown fox jumps over the lazy dog</p>
              <p className="mb-2">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="mb-2">abcdefghijklmnopqrstuvwxyz</p>
              <p>0123456789 !@#$%^&*()</p>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="titles" className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appTitle">Application Title</Label>
            <Input 
              id="appTitle"
              value={settings.appTitle}
              onChange={(e) => updateSettings({ appTitle: e.target.value })}
              placeholder="Enter application title"
            />
            <p className="text-xs text-muted-foreground">This title will be shown in the header and browser tab</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monitorPrefix">Monitor Name Prefix</Label>
            <Input 
              id="monitorPrefix"
              value={settings.monitorNamePrefix}
              onChange={(e) => updateSettings({ monitorNamePrefix: e.target.value })}
              placeholder="Enter monitor name prefix"
            />
            <p className="text-xs text-muted-foreground">This prefix will be used when creating new monitors</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="colors" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex space-x-2">
              <Input 
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input 
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="e.g. #3b82f6 or hsl(220, 70%, 50%)"
                className="flex-grow"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex space-x-2">
              <Input 
                id="secondaryColor"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input 
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                placeholder="e.g. #f3f4f6 or hsl(220, 20%, 97%)"
                className="flex-grow"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => {
            setPrimaryColor(settings.primaryColor);
            setSecondaryColor(settings.secondaryColor);
          }}>
            Reset
          </Button>
          <Button onClick={handleColorApply}>
            Apply Colors
          </Button>
        </div>
      </TabsContent>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={resetToDefaults} className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </Tabs>
  );
};

export default ThemeSettings;
