
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MoonIcon, SunIcon, PlusCircle, Activity, Server, Wifi, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";

export default function Index() {
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Check if dark mode is enabled
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, [navigate]);

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
          <Button onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-16">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight">Monitor Your Services with Real-Time Alerts</h2>
          <p className="text-xl text-muted-foreground">
            Keep track of your websites, APIs, and servers' uptime with comprehensive monitoring and instant notifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate('/login')}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-xl border bg-card">
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-4">Sample Dashboard</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{monitors.length}</div>
                  <p className="text-sm text-muted-foreground">Monitors</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-500">{monitors.filter(m => m.status === 'up').length}</div>
                  <p className="text-sm text-muted-foreground">Online</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {monitors.slice(0, 3).map((monitor) => (
                <div key={monitor.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-md">
                  <div className="flex items-center">
                    {monitor.type === 'HTTP' && <Activity className="h-4 w-4 mr-2" />}
                    {monitor.type === 'TCP' && <Server className="h-4 w-4 mr-2" />}
                    {monitor.type === 'PING' && <Wifi className="h-4 w-4 mr-2" />}
                    <span>{monitor.name}</span>
                  </div>
                  <StatusBadge status={monitor.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
        <Card>
          <CardHeader>
            <CardTitle>HTTP Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Monitor websites and APIs with HTTP checks. Set custom headers, authentication, and expected responses.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>TCP Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Check if ports are open on your servers. Perfect for monitoring databases, mail servers, and custom applications.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ICMP Ping</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Simple ping monitoring to verify hosts are online. Measure latency and packet loss for network devices.</p>
          </CardContent>
        </Card>
      </div>

      <div className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard title="Real-time Alerts" description="Get instant notifications when services go down or recover" />
          <FeatureCard title="Multiple Channels" description="Send alerts via Email, Telegram, and Discord" />
          <FeatureCard title="Dashboard" description="Visualize uptime and performance in a clean interface" />
          <FeatureCard title="Customizable" description="Set check intervals, retries, and alert thresholds" />
        </div>
      </div>

      <footer className="text-center my-12">
        <p className="text-muted-foreground">© 2023 Uptime Monitor. Demo credentials: admin@example.com / password</p>
      </footer>
    </div>
  );
}

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'up') {
    return <Badge className="bg-green-500">Up</Badge>;
  }
  return <Badge variant="destructive">Down</Badge>;
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-accent/50 rounded-lg p-6 border">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
