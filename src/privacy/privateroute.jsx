// components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('auth') === 'true';

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ error: 'You must log in first' }} replace />
  );
};

export default PrivateRoute;
