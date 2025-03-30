
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bell, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load notifications from localStorage or use mock data
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      // Create mock notifications
      const mockNotifications = [
        {
          id: 1,
          monitorId: 4,
          monitorName: "Mail Server",
          status: "down",
          message: "Connection timeout after 30s",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        {
          id: 2,
          monitorId: 2,
          monitorName: "API Service",
          status: "up",
          message: "Service is back online",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: true
        },
        {
          id: 3,
          monitorId: 3,
          monitorName: "Database",
          status: "down",
          message: "Connection refused",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true
        },
        {
          id: 4,
          monitorId: 3,
          monitorName: "Database",
          status: "up",
          message: "Service recovered",
          timestamp: new Date(Date.now() - 169200000).toISOString(),
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
      localStorage.setItem('notifications', JSON.stringify(mockNotifications));
    }
  }, [navigate]);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification: any) => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };

  const markAsRead = (id: number) => {
    const updatedNotifications = notifications.map((notification: any) => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
      localStorage.setItem('notifications', JSON.stringify([]));
      
      toast({
        title: "Success",
        description: "All notifications cleared",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold flex items-center">
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Alert History</CardTitle>
            <CardDescription>
              Recent status changes and system notifications
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={clearAllNotifications}>
              Clear all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification: any, index: number) => (
                <React.Fragment key={notification.id}>
                  <div 
                    className={`flex items-start p-3 rounded-md hover:bg-accent/50 transition-colors ${
                      !notification.read ? 'bg-accent/30' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="mr-3 mt-1">
                      {notification.status === 'up' ? (
                        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                          <X className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">
                            {notification.monitorName} is {notification.status}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="ml-2 h-2 w-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
