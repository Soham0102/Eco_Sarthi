import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    // Don't use alert here
    console.warn("Blocked non-admin access. Redirecting...");
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
