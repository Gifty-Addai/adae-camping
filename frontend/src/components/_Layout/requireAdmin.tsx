import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store/store';
import { Navigate, Outlet } from 'react-router-dom';
import { isDev } from '@/core/constants';

/**
 * Route guard for admin users.
 */
export const RequireAdmin: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userSlice);


  if (isDev || (user && user.role === 'admin')) {
    return <Outlet />;
  }

  return <Navigate to="/admin/signin" replace />;
};
