import { Navigate, Outlet } from "react-router-dom";
import * as React from "react";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * A wrapper component that checks for an authentication token in localStorage.
 * If the token is found, it renders the child routes; otherwise, it redirects to the login page.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if the authentication token is present in local storage
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    // If no token is found, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If the token is present, render the child route or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
