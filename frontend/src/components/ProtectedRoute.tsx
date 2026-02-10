import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to fetch a protected resource to verify auth
      // If this succeeds, user is authenticated
      const response = await api.get("/auth/verify");
      setIsAuthenticated(true);
    } catch (error) {
      // If request fails, user is not authenticated
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
