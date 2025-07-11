import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth"; 

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
