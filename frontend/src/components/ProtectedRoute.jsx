import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // Show a loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but wrong role, redirect to their respective dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/intern/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If everything is good, render the page
  return children;
};

export default ProtectedRoute;