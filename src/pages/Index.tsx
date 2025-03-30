
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoonIcon, SunIcon, PlusCircle, Activity, Server, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const monitors = [
    { id: 1, name: "Website", type: "HTTP", url: "https://example.com", status: "up", responseTime: 120, uptime: 99.9 },
    { id: 2, name: "API Service", type: "HTTP", url: "https://api.example.com/status", status: "up", responseTime: 220, uptime: 99.7 },
    { id: 3, name: "Database", type: "TCP", host: "db.example.com", port: 5432, status: "up", responseTime: 45, uptime: 99.8 },
    { id: 4, name: "Mail Server", type: "TCP", host: "mail.example.com", port: 25, status: "down", responseTime: 0, uptime: 98.2 },
    { id: 5, name: "Router", type: "PING", host: "192.168.1.1", status: "up", responseTime: 5, uptime: 100 }
  ];

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  const handleAddMonitor = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The add monitor feature is under development.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Activity className="mr-2" />
            Uptime Monitor
          </h1>
          <p className="text-muted-foreground">Monitor your services uptime and performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
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
              {(monitors.reduce((sum, monitor) => sum + monitor.uptime, 0) / monitors.length).toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Monitors</TabsTrigger>
          <TabsTrigger value="http">HTTP</TabsTrigger>
          <TabsTrigger value="tcp">TCP</TabsTrigger>
          <TabsTrigger value="ping">PING</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {monitors.map(monitor => (
              <MonitorCard key={monitor.id} monitor={monitor} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="http" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {monitors.filter(m => m.type === 'HTTP').map(monitor => (
              <MonitorCard key={monitor.id} monitor={monitor} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="tcp" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {monitors.filter(m => m.type === 'TCP').map(monitor => (
              <MonitorCard key={monitor.id} monitor={monitor} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="ping" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {monitors.filter(m => m.type === 'PING').map(monitor => (
              <MonitorCard key={monitor.id} monitor={monitor} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const MonitorCard = ({ monitor }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{monitor.name}</CardTitle>
            <CardDescription>
              {monitor.type === 'HTTP' && monitor.url}
              {monitor.type === 'TCP' && `${monitor.host}:${monitor.port}`}
              {monitor.type === 'PING' && monitor.host}
            </CardDescription>
          </div>
          <StatusBadge status={monitor.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Response Time</p>
            <p className="font-medium">{monitor.status === 'up' ? `${monitor.responseTime} ms` : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Uptime</p>
            <p className="font-medium">{monitor.uptime}%</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex items-center text-xs text-muted-foreground">
          {monitor.type === 'HTTP' && <Activity className="h-3 w-3 mr-1" />}
          {monitor.type === 'TCP' && <Server className="h-3 w-3 mr-1" />}
          {monitor.type === 'PING' && <Wifi className="h-3 w-3 mr-1" />}
          {monitor.type}
        </div>
      </CardFooter>
    </Card>
  );
};

const StatusBadge = ({ status }) => {
  if (status === 'up') {
    return <Badge className="bg-green-500">Up</Badge>;
  }
  return <Badge variant="destructive">Down</Badge>;
};
