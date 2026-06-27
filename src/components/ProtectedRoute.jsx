import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/account" replace />;
  }

  if (!isAdmin) {
    // Redirect to home or unauthorized page if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
