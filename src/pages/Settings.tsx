import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Download, Upload, Plus, X, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  email: string;
  password: string;
  role: string;
}

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
  
  const [userInfo, setUserInfo] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [newAdminUser, setNewAdminUser] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [users, setUsers] = useState<User[]>([]);
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
    
    // Load current user info
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserInfo(prev => ({
        ...prev,
        email: user.email
      }));
    }
    
    // Load all admin users
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      // Filter to show only admin users
      const adminUsers = parsedUsers.filter((user: User) => user.role === 'admin');
      setUsers(adminUsers);
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

  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleNewAdminUserChange = (field: string, value: string) => {
    setNewAdminUser(prev => ({
      ...prev,
      [field]: value
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
  
  const handleUpdateUser = () => {
    setLoading(true);
    
    try {
      // Validate input
      if (userInfo.newPassword && userInfo.newPassword !== userInfo.confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords do not match",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Get current user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast({
          title: "Error",
          description: "User data not found",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const currentUser = JSON.parse(userData);
      
      // Validate current password
      if (userInfo.currentPassword && userInfo.currentPassword !== currentUser.password) {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Update user data
      const updateData = {
        ...currentUser,
        email: userInfo.email
      };
      
      if (userInfo.newPassword) {
        updateData.password = userInfo.newPassword;
      }
      
      localStorage.setItem('user', JSON.stringify(updateData));
      
      // Also update in users array
      const savedUsers = localStorage.getItem('users') || '[]';
      const allUsers = JSON.parse(savedUsers);
      
      const updatedUsers = allUsers.map((user: User) => 
        user.email === currentUser.email ? { ...user, email: userInfo.email, password: userInfo.newPassword || user.password } : user
      );
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers.filter((user: User) => user.role === 'admin'));
      
      toast({
        title: "Success",
        description: "User profile updated successfully",
      });
      
      // Reset password fields
      setUserInfo(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddAdmin = () => {
    setLoading(true);
    
    try {
      // Validate input
      if (!newAdminUser.email || !newAdminUser.password) {
        toast({
          title: "Error",
          description: "Email and password are required",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      if (newAdminUser.password !== newAdminUser.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Check if email already exists
      const savedUsers = localStorage.getItem('users') || '[]';
      const allUsers = JSON.parse(savedUsers);
      
      if (allUsers.some((user: User) => user.email === newAdminUser.email)) {
        toast({
          title: "Error",
          description: "User with this email already exists",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Add new admin user
      const newUser = {
        email: newAdminUser.email,
        password: newAdminUser.password,
        role: 'admin'
      };
      
      const updatedUsers = [...allUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update local state
      setUsers(updatedUsers.filter((user: User) => user.role === 'admin'));
      
      toast({
        title: "Success",
        description: "New admin user created successfully",
      });
      
      // Reset form
      setNewAdminUser({
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new admin user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveUser = (email: string) => {
    if (window.confirm(`Are you sure you want to remove admin user ${email}?`)) {
      try {
        const savedUsers = localStorage.getItem('users') || '[]';
        const allUsers = JSON.parse(savedUsers);
        
        // Don't allow removing the currently logged in user
        const currentUserData = localStorage.getItem('user');
        if (currentUserData) {
          const currentUser = JSON.parse(currentUserData);
          if (currentUser.email === email) {
            toast({
              title: "Error",
              description: "You cannot remove your own account",
              variant: "destructive",
            });
            return;
          }
        }
        
        const updatedUsers = allUsers.filter((user: User) => user.email !== email);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Update local state
        setUsers(updatedUsers.filter((user: User) => user.role === 'admin'));
        
        toast({
          title: "Success",
          description: "Admin user removed successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove admin user",
          variant: "destructive",
        });
      }
    }
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
              <TabsTrigger value="admin">Admin</TabsTrigger>
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
            
            <TabsContent value="admin" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Profile</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email</Label>
                    <Input 
                      id="adminEmail" 
                      value={userInfo.email} 
                      onChange={(e) => handleUserInfoChange('email', e.target.value)}
                      placeholder="admin@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      value={userInfo.currentPassword} 
                      onChange={(e) => handleUserInfoChange('currentPassword', e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={userInfo.newPassword} 
                      onChange={(e) => handleUserInfoChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={userInfo.confirmPassword} 
                      onChange={(e) => handleUserInfoChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleUpdateUser} 
                    disabled={loading || (!userInfo.email && !userInfo.newPassword)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Admin Users</h3>
                  
                  <div className="space-y-4 mb-6">
                    {users.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div>
                          <p className="font-semibold">{user.email}</p>
                          <p className="text-sm text-muted-foreground">Admin</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveUser(user.email)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {users.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No admin users found</p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-md font-medium">Add New Admin</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newAdminEmail">Email</Label>
                      <Input 
                        id="newAdminEmail" 
                        value={newAdminUser.email} 
                        onChange={(e) => handleNewAdminUserChange('email', e.target.value)}
                        placeholder="new-admin@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newAdminPassword">Password</Label>
                      <Input 
                        id="newAdminPassword" 
                        type="password"
                        value={newAdminUser.password} 
                        onChange={(e) => handleNewAdminUserChange('password', e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmAdminPassword">Confirm Password</Label>
                      <Input 
                        id="confirmAdminPassword" 
                        type="password"
                        value={newAdminUser.confirmPassword} 
                        onChange={(e) => handleNewAdminUserChange('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleAddAdmin} 
                      disabled={loading || !newAdminUser.email || !newAdminUser.password || newAdminUser.password !== newAdminUser.confirmPassword}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Admin User
                    </Button>
                  </div>
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
