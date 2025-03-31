
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated || !userData) {
      toast({
        title: "Access Denied",
        description: "Please login first",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      toast({
        title: "Admin Access Required",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [navigate, toast]);

  return <>{children}</>;
};

export default AdminGuard;
