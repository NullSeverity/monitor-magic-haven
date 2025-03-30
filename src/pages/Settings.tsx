
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    email: {
      enabled: false,
      smtpServer: '',
      smtpPort: '587',
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      toEmail: ''
    },
    telegram: {
      enabled: false,
      botToken: '',
      chatId: ''
    },
    discord: {
      enabled: false,
      webhookUrl: ''
    },
    api: {
      token: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load saved settings
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      // Generate random API token if not exists
      setSettings(prev => ({
        ...prev,
        api: {
          ...prev.api,
          token: generateApiToken()
        }
      }));
    }
  }, [navigate]);

  const generateApiToken = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleToggle = (section: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        enabled: value
      }
    }));
  };

  const handleSave = () => {
    setLoading(true);
    
    try {
      localStorage.setItem('settings', JSON.stringify(settings));
      
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      // Get all data
      const exportData = {
        monitors: JSON.parse(localStorage.getItem('monitors') || '[]'),
        settings: settings
      };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `uptime-monitor-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast({
        title: "Success",
        description: "Configuration exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export configuration",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        if (importData.monitors && Array.isArray(importData.monitors)) {
          localStorage.setItem('monitors', JSON.stringify(importData.monitors));
        }
        
        if (importData.settings) {
          localStorage.setItem('settings', JSON.stringify(importData.settings));
          setSettings(importData.settings);
        }
        
        toast({
          title: "Success",
          description: "Configuration imported successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import configuration. Invalid file format.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Notification & API Settings</CardTitle>
          <CardDescription>
            Configure how you receive notifications and manage API access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="telegram">Telegram</TabsTrigger>
              <TabsTrigger value="discord">Discord</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <Button 
                  variant="outline" 
                  onClick={() => handleToggle('email', !settings.email.enabled)}
                >
                  {settings.email.enabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
              
              {settings.email.enabled && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpServer">SMTP Server</Label>
                      <Input 
                        id="smtpServer" 
                        value={settings.email.smtpServer} 
                        onChange={(e) => handleInputChange('email', 'smtpServer', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        value={settings.email.smtpPort} 
                        onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
                        placeholder="587"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input 
                        id="smtpUser" 
                        value={settings.email.smtpUser} 
                        onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
                        placeholder="user@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input 
                        id="smtpPassword" 
                        type="password"
                        value={settings.email.smtpPassword} 
                        onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                        placeholder="•••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input 
                        id="fromEmail" 
                        value={settings.email.fromEmail} 
                        onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                        placeholder="alerts@yourdomain.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="toEmail">To Email</Label>
                      <Input 
                        id="toEmail" 
                        value={settings.email.toEmail} 
                        onChange={(e) => handleInputChange('email', 'toEmail', e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="telegram" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Telegram Notifications</h3>
                <Button 
                  variant="outline" 
                  onClick={() => handleToggle('telegram', !settings.telegram.enabled)}
                >
                  {settings.telegram.enabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
              
              {settings.telegram.enabled && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="botToken">Telegram Bot Token</Label>
                    <Input 
                      id="botToken" 
                      value={settings.telegram.botToken} 
                      onChange={(e) => handleInputChange('telegram', 'botToken', e.target.value)} 
                      placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                    />
                    <p className="text-xs text-muted-foreground">Create a bot via @BotFather and get the token</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="chatId">Chat ID</Label>
                    <Input 
                      id="chatId" 
                      value={settings.telegram.chatId} 
                      onChange={(e) => handleInputChange('telegram', 'chatId', e.target.value)} 
                      placeholder="-1001234567890 or @channelname"
                    />
                    <p className="text-xs text-muted-foreground">Your Telegram user ID, group ID, or channel name</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="discord" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Discord Notifications</h3>
                <Button 
                  variant="outline" 
                  onClick={() => handleToggle('discord', !settings.discord.enabled)}
                >
                  {settings.discord.enabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
              
              {settings.discord.enabled && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Discord Webhook URL</Label>
                    <Input 
                      id="webhookUrl" 
                      value={settings.discord.webhookUrl} 
                      onChange={(e) => handleInputChange('discord', 'webhookUrl', e.target.value)} 
                      placeholder="https://discord.com/api/webhooks/..."
                    />
                    <p className="text-xs text-muted-foreground">Create a webhook in your Discord server's settings</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <h3 className="text-lg font-medium">API Settings</h3>
              <p className="text-muted-foreground">Use this token to access the API for custom integrations</p>
              
              <div className="space-y-2">
                <Label htmlFor="apiToken">API Token</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="apiToken" 
                    value={settings.api.token} 
                    readOnly
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const newToken = generateApiToken();
                      handleInputChange('api', 'token', newToken);
                      toast({
                        title: "Success",
                        description: "New API token generated. Don't forget to save!",
                      });
                    }}
                  >
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Keep this secret! Anyone with this token can access your monitoring data.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="backup" className="space-y-4">
              <h3 className="text-lg font-medium">Backup & Restore</h3>
              <p className="text-muted-foreground">Export or import your monitoring configuration</p>
              
              <div className="flex space-x-4 mt-4">
                <Button onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Configuration
                </Button>
                
                <div>
                  <input
                    type="file"
                    id="import-file"
                    className="hidden"
                    accept=".json"
                    onChange={handleImport}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('import-file')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Configuration
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={loading} className="ml-auto">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
