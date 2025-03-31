
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Activity } from "lucide-react";

// Define user types with roles
type UserRole = 'admin' | 'user';

interface User {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// Mock users database
const USERS: User[] = [
  { 
    email: 'admin@example.com', 
    password: 'adminpass', 
    name: 'Admin User', 
    role: 'admin' 
  },
  { 
    email: 'user@example.com', 
    password: 'userpass', 
    name: 'Regular User', 
    role: 'user' 
  }
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // For demo purposes, simple validation and mock authentication
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Authentication logic
    setTimeout(() => {
      const user = USERS.find(user => user.email === email && user.password === password);
      
      if (user) {
        toast({
          title: "Success",
          description: `You've been logged in successfully as ${user.role}`,
        });
        
        // Save user info with role to localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }));
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid credentials. Try admin@example.com / adminpass or user@example.com / userpass",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Activity className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Uptime Monitor</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="adminpass" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Admin access:</strong> admin@example.com / adminpass<br />
              <strong>Regular user:</strong> user@example.com / userpass
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
