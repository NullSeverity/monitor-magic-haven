import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Trash2, Plus, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Monitor } from "@/types/monitor";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";

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
    stringCheckEnabled: false,
    headers: [],
    triggers: [],
    userAgent: 'Mozilla/5.0 (compatible; UptimeMonitor/1.0)',
    followRedirects: true,
    maxRedirects: 5
  });
  
  const [notifyOptions, setNotifyOptions] = useState({
    email: false,
    telegram: false,
    discord: false
  });
  
  const [headerKey, setHeaderKey] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [triggerUrl, setTriggerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
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

  const addHeader = () => {
    if (!headerKey || !headerValue) {
      toast({
        title: "Validation Error",
        description: "Both header name and value are required",
        variant: "destructive",
      });
      return;
    }

    setMonitor(prev => ({
      ...prev,
      headers: [...(prev.headers || []), { key: headerKey, value: headerValue }]
    }));
    
    setHeaderKey('');
    setHeaderValue('');
  };

  const removeHeader = (index: number) => {
    setMonitor(prev => ({
      ...prev,
      headers: prev.headers?.filter((_, i) => i !== index)
    }));
  };

  const addTrigger = () => {
    if (!triggerUrl) {
      toast({
        title: "Validation Error",
        description: "Trigger URL is required",
        variant: "destructive",
      });
      return;
    }

    if (!triggerUrl.startsWith('http://') && !triggerUrl.startsWith('https://')) {
      toast({
        title: "Validation Error",
        description: "Trigger URL must start with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setMonitor(prev => ({
      ...prev,
      triggers: [...(prev.triggers || []), triggerUrl]
    }));
    
    setTriggerUrl('');
  };

  const removeTrigger = (index: number) => {
    setMonitor(prev => ({
      ...prev,
      triggers: prev.triggers?.filter((_, i) => i !== index)
    }));
  };

  const checkMonitor = async () => {
    if (!validateMonitor()) return;
    
    setChecking(true);
    
    setTimeout(() => {
      const isUp = Math.random() > 0.3;
      const responseTime = isUp ? Math.floor(Math.random() * 500) + 50 : 0;
      
      let stringCheckResult;
      if (monitor.stringCheckEnabled && isUp) {
        stringCheckResult = Math.random() > 0.3; // 70% chance of successful string check
      }
      
      setMonitor(prev => ({
        ...prev,
        status: isUp ? 'up' : 'down',
        responseTime,
        lastChecked: new Date().toISOString(),
        stringCheckResult: monitor.stringCheckEnabled ? stringCheckResult : undefined
      }));
      
      let title, description, variant;
      
      if (!isUp) {
        title = "Monitor is Down";
        description = "Failed to connect";
        variant = "destructive";
      } else if (monitor.stringCheckEnabled && !stringCheckResult) {
        title = "String Check Failed";
        description = `Connection OK but expected string not found (${responseTime}ms)`;
        variant = "destructive";
      } else {
        title = "Monitor is Up";
        description = `Response time: ${responseTime}ms`;
        variant = "default";
      }
      
      toast({
        title,
        description,
        variant,
      });
      
      setChecking(false);
    }, 2000);
  };

  const validateMonitor = () => {
    if (!monitor.name) {
      toast({
        title: "Validation Error",
        description: "Monitor name is required",
        variant: "destructive",
      });
      return false;
    }

    if (monitor.type === 'HTTP' && !monitor.url) {
      toast({
        title: "Validation Error",
        description: "URL is required for HTTP monitors",
        variant: "destructive",
      });
      return false;
    }

    if ((monitor.type === 'TCP' || monitor.type === 'PING') && !monitor.host) {
      toast({
        title: "Validation Error",
        description: "Host is required",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSave = () => {
    setLoading(true);

    if (!validateMonitor()) {
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
          notifications,
          lastChecked: new Date().toISOString()
        };
        
        monitors.push(newMonitor);
        localStorage.setItem('monitors', JSON.stringify(monitors));
        
        toast({
          title: "Success",
          description: "Monitor created successfully",
        });
        
        setTimeout(() => {
          const updatedMonitors = JSON.parse(localStorage.getItem('monitors') || '[]');
          const monitorToCheck = updatedMonitors.find((m: Monitor) => m.id === newId);
          
          if (monitorToCheck) {
            const isUp = Math.random() > 0.3;
            const responseTime = isUp ? Math.floor(Math.random() * 500) + 50 : 0;
            
            let stringCheckResult;
            if (monitorToCheck.stringCheckEnabled && isUp) {
              stringCheckResult = Math.random() > 0.3; // 70% chance of successful string check
            }
            
            const checkedMonitors = updatedMonitors.map((m: Monitor) => 
              m.id === newId ? { 
                ...m, 
                status: isUp ? 'up' : 'down', 
                responseTime,
                lastChecked: new Date().toISOString(),
                stringCheckResult: m.stringCheckEnabled ? stringCheckResult : undefined
              } : m
            );
            
            localStorage.setItem('monitors', JSON.stringify(checkedMonitors));
            
            let title, description, variant;
            
            if (!isUp) {
              title = "Initial Check: DOWN";
              description = `${newMonitor.name} is down`;
              variant = "destructive";
            } else if (monitorToCheck.stringCheckEnabled && !stringCheckResult) {
              title = "Initial Check: String Check Failed";
              description = `${newMonitor.name} is up but string check failed (${responseTime}ms)`;
              variant = "destructive";
            } else {
              title = "Initial Check: UP";
              description = `${newMonitor.name} is up (${responseTime}ms)`;
              variant = "default";
            }
            
            toast({
              title,
              description,
              variant,
            });
          }
        }, 1000);
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
        
        setTimeout(() => {
          const updatedMonitorsAfterSave = JSON.parse(localStorage.getItem('monitors') || '[]');
          const monitorToCheck = updatedMonitorsAfterSave.find((m: Monitor) => m.id === parseInt(id || '0'));
          
          if (monitorToCheck) {
            const isUp = Math.random() > 0.3;
            const responseTime = isUp ? Math.floor(Math.random() * 500) + 50 : 0;
            
            let stringCheckResult;
            if (monitorToCheck.stringCheckEnabled && isUp) {
              stringCheckResult = Math.random() > 0.3; // 70% chance of successful string check
            }
            
            const checkedMonitors = updatedMonitorsAfterSave.map((m: Monitor) => 
              m.id === parseInt(id || '0') ? { 
                ...m, 
                status: isUp ? 'up' : 'down', 
                responseTime,
                lastChecked: new Date().toISOString(),
                stringCheckResult: m.stringCheckEnabled ? stringCheckResult : undefined
              } : m
            );
            
            localStorage.setItem('monitors', JSON.stringify(checkedMonitors));
            
            let title, description, variant;
            
            if (!isUp) {
              title = "Check after update: DOWN";
              description = `${monitorToCheck.name} is down`;
              variant = "destructive";
            } else if (monitorToCheck.stringCheckEnabled && !stringCheckResult) {
              title = "Check after update: String Check Failed";
              description = `${monitorToCheck.name} is up but string check failed (${responseTime}ms)`;
              variant = "destructive";
            } else {
              title = "Check after update: UP";
              description = `${monitorToCheck.name} is up (${responseTime}ms)`;
              variant = "default";
            }
            
            toast({
              title,
              description,
              variant,
            });
          }
        }, 1000);
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
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
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
                
                <div className="mt-2 flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center"
                    onClick={checkMonitor}
                    disabled={checking}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
                    {checking ? 'Checking...' : 'Test Connection'}
                  </Button>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="userAgent">User Agent</Label>
                    <Input
                      id="userAgent"
                      name="userAgent"
                      value={monitor.userAgent}
                      onChange={handleInputChange}
                      placeholder="Mozilla/5.0 (compatible; UptimeMonitor/1.0)"
                    />
                    <p className="text-xs text-muted-foreground">
                      The User-Agent header that will be sent with requests
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="followRedirects"
                        checked={monitor.followRedirects}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('followRedirects', checked === true)
                        }
                      />
                      <Label htmlFor="followRedirects">Follow Redirects</Label>
                    </div>
                    
                    {monitor.followRedirects && (
                      <div className="pl-6 pt-2">
                        <Label htmlFor="maxRedirects">Maximum Redirects</Label>
                        <Input
                          id="maxRedirects"
                          name="maxRedirects"
                          type="number"
                          value={monitor.maxRedirects}
                          onChange={handleInputChange}
                          placeholder="5"
                          className="mt-1 w-24"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum number of redirects to follow (0-10)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Headers</Label>
                    <div className="space-y-2">
                      {monitor.headers?.map((header, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1 bg-muted p-2 rounded-md">
                            <span className="font-semibold">{header.key}:</span> {header.value}
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeHeader(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input 
                        placeholder="Header name" 
                        value={headerKey}
                        onChange={(e) => setHeaderKey(e.target.value)}
                      />
                      <Input 
                        placeholder="Header value" 
                        value={headerValue}
                        onChange={(e) => setHeaderValue(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addHeader}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Header
                    </Button>
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

            <TabsContent value="triggers" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Down Triggers</h3>
                <p className="text-muted-foreground">
                  Add URLs to be requested when the monitor goes down
                </p>
                
                <div className="space-y-2">
                  {monitor.triggers?.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1 bg-muted p-2 rounded-md break-all">
                        {url}
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeTrigger(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input 
                    className="flex-1"
                    placeholder="https://example.com/trigger" 
                    value={triggerUrl}
                    onChange={(e) => setTriggerUrl(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addTrigger}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  These URLs will be requested when the monitor goes down. Use webhooks or API endpoints that can trigger actions in other systems.
                </p>
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
