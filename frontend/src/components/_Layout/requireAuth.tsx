import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store/store';
import { Navigate, Outlet } from 'react-router-dom';

export const RequireAuth: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userSlice);
  
  // If user is not authenticated, redirect to login (or your choice).
  if (!user) {
    return <Navigate to="/admin/signin" replace />;
  }

  // Otherwise, render child routes
  return <Outlet />;
};
