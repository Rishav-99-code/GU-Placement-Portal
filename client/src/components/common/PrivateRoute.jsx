// frontend/src/components/auth/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import your AuthContext

const PrivateRoute = ({ allowedRoles, children }) => {
  const { authState } = useContext(AuthContext); // Access authState from context

  if (!authState.isAuthenticated) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Check if user object and role exist in authState.user
  if (allowedRoles && authState.user && !allowedRoles.includes(authState.user.role)) {
    // Authenticated but role not allowed, redirect to a forbidden page or homepage
    console.warn(`User with role "${authState.user.role}" attempted to access restricted route. Allowed roles: ${allowedRoles.join(', ')}`);
    // You can customize this redirect further, e.g., to a specific "Access Denied" page
    return <Navigate to="/" replace />; // Redirect to homepage or an access denied page
  }

  // Authenticated and authorized, render the child components
  return children ? children : <Outlet />;
};

export default PrivateRoute;