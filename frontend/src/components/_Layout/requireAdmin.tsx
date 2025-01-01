import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store/store';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Route guard for admin users.
 */
export const RequireAdmin: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userSlice);

  // Check if user is authenticated and has role === 'admin'
  if (!user || user.role !== 'admin') {
    // Redirect if not admin
    return <Navigate to="/admin/signin" replace />;
  }

  // If admin, render child routes
  return <Outlet />;
};
