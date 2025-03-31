
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Wifi, Clock, Bell, ChevronDown, RefreshCw, ExternalLink, Heart, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Monitor } from "@/types/monitor";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface MonitorCardProps {
  monitor: Monitor;
  onEdit: () => void;
  onCheck: () => void;
}

const MonitorCard: React.FC<MonitorCardProps> = ({ monitor, onEdit, onCheck }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [statusHistory, setStatusHistory] = useState<Array<'up' | 'down' | 'pending'>>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize or get status history from localStorage
    const storageKey = `status_history_${monitor.id}`;
    const storedHistory = localStorage.getItem(storageKey);
    
    if (storedHistory) {
      setStatusHistory(JSON.parse(storedHistory));
    } else {
      // Initialize with current status repeated a few times for visualization
      const initialHistory = Array(30).fill(monitor.status);
      setStatusHistory(initialHistory);
      localStorage.setItem(storageKey, JSON.stringify(initialHistory));
    }
  }, [monitor.id, monitor.status]);

  useEffect(() => {
    // Update history when monitor status changes
    if (monitor.status && monitor.lastChecked) {
      updateStatusHistory(monitor.status);
    }
  }, [monitor.lastChecked]);

  const updateStatusHistory = (newStatus: 'up' | 'down' | 'pending') => {
    setStatusHistory(prevHistory => {
      const updatedHistory = [...prevHistory.slice(1), newStatus];
      localStorage.setItem(`status_history_${monitor.id}`, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const getStatusIcon = () => {
    switch (monitor.type) {
      case 'HTTP':
        return <Activity className="h-4 w-4 mr-1" />;
      case 'TCP':
        return <Server className="h-4 w-4 mr-1" />;
      case 'PING':
        return <Wifi className="h-4 w-4 mr-1" />;
      default:
        return <Activity className="h-4 w-4 mr-1" />;
    }
  };

  const getResponseTimeIndicator = () => {
    if (monitor.status !== 'up' || !monitor.responseTime) return null;
    
    let color = 'text-green-500';
    if (monitor.responseTime > 500) color = 'text-yellow-500';
    if (monitor.responseTime > 1000) color = 'text-red-500';
    
    return (
      <div className="flex items-center">
        <Heart className={`h-3 w-3 mr-1 ${color}`} />
        <span className={color}>{monitor.responseTime} ms</span>
      </div>
    );
  };

  const handleManualCheck = async () => {
    setIsChecking(true);
    onCheck();
    
    // Simulate check process
    setTimeout(() => {
      setIsChecking(false);
      toast({
        title: "Check Complete",
        description: `Status check for ${monitor.name} completed.`,
      });
    }, 2000);
  };

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="py-3 px-4 relative">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              {monitor.name}
              {monitor.group && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {monitor.group}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              {monitor.type === 'HTTP' && monitor.url}
              {monitor.type === 'TCP' && `${monitor.host}:${monitor.port}`}
              {monitor.type === 'PING' && monitor.host}
            </CardDescription>
          </div>
          <div className="flex items-center">
            <StatusBadge status={monitor.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>View Details</DropdownMenuItem>
                <DropdownMenuItem onClick={handleManualCheck} disabled={isChecking}>
                  {isChecking ? "Checking..." : "Check Now"}
                </DropdownMenuItem>
                {monitor.url && (
                  <DropdownMenuItem onClick={() => window.open(monitor.url, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />Visit Site
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Status History Metrics Bar */}
      <div className="px-4 py-1 flex space-x-0.5">
        {statusHistory.map((status, index) => (
          <div 
            key={index} 
            className={`h-2 flex-1 rounded-sm ${
              status === 'up' ? 'bg-green-500' : 
              status === 'down' ? 'bg-red-500' : 
              'bg-yellow-500'
            }`}
            title={`Status: ${status}`}
          />
        ))}
      </div>

      <CardContent className="py-2 px-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-3">
            {getResponseTimeIndicator() || (
              <span className="text-muted-foreground">
                {monitor.status === 'up' ? `${monitor.responseTime} ms` : 'N/A'}
              </span>
            )}
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 inline mr-1" />
              {monitor.interval}s
            </span>
            <span className="text-muted-foreground flex items-center">
              <Gauge className="h-3 w-3 inline mr-1" />
              {monitor.uptime}%
            </span>
          </div>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2 mr-1"
              onClick={handleManualCheck} 
              disabled={isChecking}
            >
              <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
              <span className="ml-1 text-xs">{isChecking ? 'Checking' : 'Check'}</span>
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2" onClick={onEdit}>
              Details
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="py-2 px-4 border-t bg-muted/30">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center">
            {getStatusIcon()}
            <span className="mr-2">{monitor.type}</span>
            {monitor.triggers && monitor.triggers.length > 0 && (
              <Badge variant="outline" className="text-xs border-blue-400 text-blue-500">
                <Bell className="h-2 w-2 mr-1" /> {monitor.triggers.length}
              </Badge>
            )}
          </div>
          <div>
            {monitor.lastChecked && `Last checked: ${new Date(monitor.lastChecked).toLocaleTimeString()}`}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: 'up' | 'down' | 'pending' }) => {
  if (status === 'up') {
    return <Badge className="bg-green-500">Up</Badge>;
  } else if (status === 'pending') {
    return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
  }
  return <Badge variant="destructive">Down</Badge>;
};

export default MonitorCard;
