import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Monitor } from "@/types/monitor";
import { Textarea } from "@/components/ui/textarea";

export default function MonitorForm() {
  const [monitor, setMonitor] = useState<Partial<Monitor>>({
    name: '',
    type: 'HTTP',
    url: '',
    host: '',
    port: 80,
    interval: 60,
    method: 'GET',
    status: 'pending',
    responseTime: 0,
    uptime: 0,
    group: 'Default',
    expectedString: '',
    stringCheckEnabled: false
  });
  const [notifyOptions, setNotifyOptions] = useState({
    email: false,
    telegram: false,
    discord: false
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewMonitor = id === 'new';

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isNewMonitor) {
      const savedMonitors = localStorage.getItem('monitors');
      if (savedMonitors) {
        const monitors = JSON.parse(savedMonitors);
        const foundMonitor = monitors.find((m: Monitor) => m.id === parseInt(id || '0'));
        if (foundMonitor) {
          setMonitor(foundMonitor);
          
          if (foundMonitor.notifications) {
            setNotifyOptions({
              email: foundMonitor.notifications.includes('email'),
              telegram: foundMonitor.notifications.includes('telegram'),
              discord: foundMonitor.notifications.includes('discord')
            });
          }
        } else {
          navigate('/dashboard');
          toast({
            title: "Error",
            description: "Monitor not found",
            variant: "destructive",
          });
        }
      }
    }
  }, [id, isNewMonitor, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMonitor(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setMonitor(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setMonitor(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    setLoading(true);

    if (!monitor.name) {
      toast({
        title: "Validation Error",
        description: "Monitor name is required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (monitor.type === 'HTTP' && !monitor.url) {
      toast({
        title: "Validation Error",
        description: "URL is required for HTTP monitors",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if ((monitor.type === 'TCP' || monitor.type === 'PING') && !monitor.host) {
      toast({
        title: "Validation Error",
        description: "Host is required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const notifications = [];
    if (notifyOptions.email) notifications.push('email');
    if (notifyOptions.telegram) notifications.push('telegram');
    if (notifyOptions.discord) notifications.push('discord');

    try {
      const savedMonitors = localStorage.getItem('monitors') || '[]';
      const monitors = JSON.parse(savedMonitors);

      if (isNewMonitor) {
        const newId = monitors.length > 0 
          ? Math.max(...monitors.map((m: Monitor) => m.id)) + 1 
          : 1;
        
        const newMonitor = {
          ...monitor,
          id: newId,
          status: 'pending',
          responseTime: 0,
          uptime: 100,
          notifications
        };
        
        monitors.push(newMonitor);
        localStorage.setItem('monitors', JSON.stringify(monitors));
        
        toast({
          title: "Success",
          description: "Monitor created successfully",
        });
      } else {
        const updatedMonitors = monitors.map((m: Monitor) => 
          m.id === parseInt(id || '0') 
            ? { ...m, ...monitor, notifications }
            : m
        );
        
        localStorage.setItem('monitors', JSON.stringify(updatedMonitors));
        
        toast({
          title: "Success",
          description: "Monitor updated successfully",
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save monitor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!isNewMonitor && window.confirm('Are you sure you want to delete this monitor?')) {
      try {
        const savedMonitors = localStorage.getItem('monitors') || '[]';
        const monitors = JSON.parse(savedMonitors);
        const updatedMonitors = monitors.filter((m: Monitor) => m.id !== parseInt(id || '0'));
        
        localStorage.setItem('monitors', JSON.stringify(updatedMonitors));
        
        toast({
          title: "Success",
          description: "Monitor deleted successfully",
        });
        
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete monitor",
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
        <h1 className="text-2xl font-bold">
          {isNewMonitor ? 'Add New Monitor' : 'Edit Monitor'}
        </h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{isNewMonitor ? 'New Monitor' : monitor.name}</CardTitle>
          <CardDescription>
            {isNewMonitor 
              ? 'Create a new uptime monitor for your service' 
              : 'Edit your monitor settings and notifications'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notification">Notifications</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Monitor Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={monitor.name} 
                      onChange={handleInputChange} 
                      placeholder="My Website" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Monitor Type</Label>
                    <Select
                      value={monitor.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select monitor type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HTTP">HTTP(S)</SelectItem>
                        <SelectItem value="TCP">TCP</SelectItem>
                        <SelectItem value="PING">PING (ICMP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {monitor.type === 'HTTP' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <Input 
                        id="url" 
                        name="url" 
                        value={monitor.url} 
                        onChange={handleInputChange} 
                        placeholder="https://example.com" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox 
                          id="stringCheckEnabled" 
                          checked={monitor.stringCheckEnabled} 
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('stringCheckEnabled', checked === true)
                          } 
                        />
                        <Label htmlFor="stringCheckEnabled">Check for specific string in response</Label>
                      </div>
                      
                      {monitor.stringCheckEnabled && (
                        <div className="pl-6">
                          <Label htmlFor="expectedString">Expected String</Label>
                          <Textarea 
                            id="expectedString" 
                            name="expectedString" 
                            value={monitor.expectedString} 
                            onChange={handleInputChange} 
                            placeholder="Enter text that should appear in the response"
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            The monitor will be marked as down if this text is not found in the response
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {(monitor.type === 'TCP' || monitor.type === 'PING') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="host">Host</Label>
                      <Input 
                        id="host" 
                        name="host" 
                        value={monitor.host} 
                        onChange={handleInputChange} 
                        placeholder="example.com or 192.168.1.1" 
                      />
                    </div>
                    {monitor.type === 'TCP' && (
                      <div className="space-y-2">
                        <Label htmlFor="port">Port</Label>
                        <Input 
                          id="port" 
                          name="port" 
                          type="number" 
                          value={monitor.port} 
                          onChange={handleInputChange} 
                          placeholder="80" 
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interval">Check Interval (seconds)</Label>
                    <Input 
                      id="interval" 
                      name="interval" 
                      type="number" 
                      value={monitor.interval} 
                      onChange={handleInputChange} 
                      placeholder="60" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group">Group</Label>
                    <Input 
                      id="group" 
                      name="group" 
                      value={monitor.group} 
                      onChange={handleInputChange} 
                      placeholder="Production" 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notification" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Notification Channels</h3>
                <p className="text-muted-foreground">Select where to send alerts when status changes</p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email-notify" 
                      checked={notifyOptions.email}
                      onCheckedChange={(checked) => 
                        setNotifyOptions(prev => ({ ...prev, email: checked === true }))
                      } 
                    />
                    <Label htmlFor="email-notify">Send Email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="telegram-notify" 
                      checked={notifyOptions.telegram}
                      onCheckedChange={(checked) => 
                        setNotifyOptions(prev => ({ ...prev, telegram: checked === true }))
                      } 
                    />
                    <Label htmlFor="telegram-notify">Telegram</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="discord-notify" 
                      checked={notifyOptions.discord}
                      onCheckedChange={(checked) => 
                        setNotifyOptions(prev => ({ ...prev, discord: checked === true }))
                      } 
                    />
                    <Label htmlFor="discord-notify">Discord</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              {monitor.type === 'HTTP' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="method">HTTP Method</Label>
                    <Select
                      value={monitor.method || 'GET'}
                      onValueChange={(value) => handleSelectChange('method', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select HTTP method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="HEAD">HEAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="retries">Retries before alert</Label>
                <Input 
                  id="retries" 
                  name="retries" 
                  type="number" 
                  value={monitor.retries || 1} 
                  onChange={handleInputChange} 
                  placeholder="1" 
                />
                <p className="text-xs text-muted-foreground">Number of failed checks before notification is sent</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isNewMonitor && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          )}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Monitor'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
