import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner or skeleton while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin access is endpoint-verified (isAdmin from the real /dashboard/admin/ call).
  // If any role gate requires admin, the server-confirmed isAdmin must be true.
  const requiresAdmin = roles.includes('admin');
  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // For non-admin role gates, fall back to the server-returned user_type.
  const allowedRoles = roles.filter(r => r !== 'admin');
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.user_type) && !isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If user is authenticated and has required role, render the children
  return children;
};

export default ProtectedRoute;
