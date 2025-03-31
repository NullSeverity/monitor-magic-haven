import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoonIcon, SunIcon, PlusCircle, Activity, Settings, Bell, LogOut, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import MonitorCard from "@/components/MonitorCard";
import { Monitor } from "@/types/monitor";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get user role
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role as 'admin' | 'user');
    }

    // Load monitors from localStorage or use mock data
    const savedMonitors = localStorage.getItem('monitors');
    if (savedMonitors) {
      setMonitors(JSON.parse(savedMonitors));
    } else {
      // Mock data for demonstration - ensure types match the Monitor interface exactly
      const mockMonitors: Monitor[] = [
        { id: 1, name: "Website", type: "HTTP", url: "https://example.com", status: "up", responseTime: 120, uptime: 99.9, interval: 60, group: "Production" },
        { id: 2, name: "API Service", type: "HTTP", url: "https://api.example.com/status", status: "up", responseTime: 220, uptime: 99.7, interval: 30, group: "Production" },
        { id: 3, name: "Database", type: "TCP", host: "db.example.com", port: 5432, status: "up", responseTime: 45, uptime: 99.8, interval: 60, group: "Database" },
        { id: 4, name: "Mail Server", type: "TCP", host: "mail.example.com", port: 25, status: "down", responseTime: 0, uptime: 98.2, interval: 120, group: "Mail" },
        { id: 5, name: "Router", type: "PING", host: "192.168.1.1", status: "up", responseTime: 5, uptime: 100, interval: 60, group: "Network" }
      ];
      setMonitors(mockMonitors);
      localStorage.setItem('monitors', JSON.stringify(mockMonitors));
    }

    // Check current theme preference
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, [navigate]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  const handleAddMonitor = () => {
    navigate('/monitor/new');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleManualCheck = (monitorId: number) => {
    // Find the monitor to check
    const monitorToCheck = monitors.find(m => m.id === monitorId);
    if (!monitorToCheck) return;

    // Update monitor status to pending during check
    const updatedMonitors = monitors.map(m => 
      m.id === monitorId ? { ...m, status: 'pending', lastChecked: new Date().toISOString() } : m
    );
    setMonitors(updatedMonitors);
    localStorage.setItem('monitors', JSON.stringify(updatedMonitors));

    // Simulate check process - in a real app, this would be an actual HTTP request
    setTimeout(() => {
      // Generate a random status (up/down) for simulation
      const newStatus = Math.random() > 0.2 ? 'up' : 'down';
      const responseTime = newStatus === 'up' ? Math.floor(Math.random() * 500) + 50 : 0;
      
      const checkedMonitors = updatedMonitors.map(m => 
        m.id === monitorId ? { 
          ...m, 
          status: newStatus, 
          responseTime: responseTime,
          lastChecked: new Date().toISOString()
        } : m
      );
      
      setMonitors(checkedMonitors);
      localStorage.setItem('monitors', JSON.stringify(checkedMonitors));
      
      toast({
        title: `Monitor ${newStatus.toUpperCase()}`,
        description: `${monitorToCheck.name} is ${newStatus}`,
        variant: newStatus === 'up' ? 'default' : 'destructive',
      });
    }, 2000);
  };

  // Get unique groups for filtering
  const groups = ['All', ...new Set(monitors.map(m => m.group))];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Activity className="mr-2" />
            Uptime Monitor
            {userRole === 'admin' && (
              <Badge variant="outline" className="ml-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                <Shield className="h-3 w-3 mr-1" /> Admin
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Monitor your services uptime and performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </Button>
          
          {/* Only show Settings button to admins */}
          {userRole === 'admin' && (
            <Button variant="outline" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4" />
            </Button>
          )}
          
          <Button variant="outline" size="icon" onClick={() => navigate('/notifications')}>
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddMonitor}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Monitor
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Monitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monitors Up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{monitors.filter(m => m.status === 'up').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monitors Down</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{monitors.filter(m => m.status === 'down').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monitors.length > 0 
                ? (monitors.reduce((sum, monitor) => sum + monitor.uptime, 0) / monitors.length).toFixed(2) 
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Monitors</TabsTrigger>
            <TabsTrigger value="http">HTTP</TabsTrigger>
            <TabsTrigger value="tcp">TCP</TabsTrigger>
            <TabsTrigger value="ping">PING</TabsTrigger>
          </TabsList>
          
          {groups.length > 1 && (
            <select 
              className="bg-background border border-input rounded-md px-3 py-2 text-sm" 
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'All') {
                  navigate('/dashboard');
                } else {
                  navigate(`/dashboard?group=${encodeURIComponent(value)}`);
                }
              }}
            >
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          )}
        </div>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {monitors.map(monitor => (
              <MonitorCard 
                key={monitor.id} 
                monitor={monitor} 
                onEdit={() => navigate(`/monitor/${monitor.id}`)} 
                onCheck={() => handleManualCheck(monitor.id)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="http" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {monitors.filter(m => m.type === 'HTTP').map(monitor => (
              <MonitorCard 
                key={monitor.id} 
                monitor={monitor} 
                onEdit={() => navigate(`/monitor/${monitor.id}`)} 
                onCheck={() => handleManualCheck(monitor.id)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="tcp" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {monitors.filter(m => m.type === 'TCP').map(monitor => (
              <MonitorCard 
                key={monitor.id} 
                monitor={monitor} 
                onEdit={() => navigate(`/monitor/${monitor.id}`)} 
                onCheck={() => handleManualCheck(monitor.id)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="ping" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {monitors.filter(m => m.type === 'PING').map(monitor => (
              <MonitorCard 
                key={monitor.id} 
                monitor={monitor} 
                onEdit={() => navigate(`/monitor/${monitor.id}`)} 
                onCheck={() => handleManualCheck(monitor.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
