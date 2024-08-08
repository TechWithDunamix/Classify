// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return isAuthenticated ? element : <Navigate to="/signup" />;
};

export default PrivateRoute;
