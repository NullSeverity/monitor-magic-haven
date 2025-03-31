
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Wifi, Clock, Bell, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Monitor } from "@/types/monitor";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface MonitorCardProps {
  monitor: Monitor;
  onEdit: () => void;
  onCheck: () => void;
}

const MonitorCard: React.FC<MonitorCardProps> = ({ monitor, onEdit, onCheck }) => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="py-3 px-4">
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <span className="text-muted-foreground mr-4">
              {monitor.status === 'up' ? `${monitor.responseTime} ms` : 'N/A'}
            </span>
            <span className="text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              {monitor.interval}s
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
      <CardFooter className="py-2 px-4 border-t">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div>
            {getStatusIcon()}
            {monitor.type}
          </div>
          <div>
            {monitor.lastChecked && `Last checked: ${new Date(monitor.lastChecked).toLocaleTimeString()}`}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'up') {
    return <Badge className="bg-green-500">Up</Badge>;
  } else if (status === 'pending') {
    return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
  }
  return <Badge variant="destructive">Down</Badge>;
};

export default MonitorCard;
