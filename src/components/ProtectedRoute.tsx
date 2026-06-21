import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProtectedRoute.css';

export function ProtectedRoute() {
  const { ready, isAuthenticated } = useAuth();

  // Temporarily bypass authentication loading for testing
  if (!ready) {
    return <Outlet />;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
