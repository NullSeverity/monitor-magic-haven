
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Wifi, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Monitor } from "@/types/monitor";

interface MonitorCardProps {
  monitor: Monitor;
  onEdit: () => void;
}

const MonitorCard: React.FC<MonitorCardProps> = ({ monitor, onEdit }) => {
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
          <div className="flex items-center">
            {monitor.group && (
              <Badge variant="outline" className="mr-2">
                {monitor.group}
              </Badge>
            )}
            <StatusBadge status={monitor.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Response Time</p>
            <p className="font-medium">{monitor.status === 'up' ? `${monitor.responseTime} ms` : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Uptime</p>
            <p className="font-medium">{monitor.uptime}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Check Interval</p>
            <p className="font-medium flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {monitor.interval}s
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          {getStatusIcon()}
          {monitor.type}
          {monitor.notifications && monitor.notifications.length > 0 && (
            <span className="ml-2 flex items-center">
              <Bell className="h-3 w-3 mr-1" />
              {monitor.notifications.length} alert{monitor.notifications.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          View Details
        </Button>
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
