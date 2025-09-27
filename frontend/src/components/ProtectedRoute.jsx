import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false, requireWorker = false, requireCitizen = false }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isWorker = localStorage.getItem("isWorker") === "true";
  const isCitizen = localStorage.getItem("isCitizen") === "true";

  // Admin-only routes
  if (requireAdmin && !isAdmin) {
    console.warn("Blocked non-admin access. Redirecting...");
    return <Navigate to="/admin-login" replace />;
  }

  // Worker-only routes
  if (requireWorker && !isWorker) {
    console.warn("Blocked non-worker access. Redirecting...");
    return <Navigate to="/worker-login" replace />;
  }

  // Citizen-only routes
  if (requireCitizen && !isCitizen) {
    console.warn("Blocked non-citizen access. Redirecting...");
    return <Navigate to="/user-login" replace />;
  }

  // General protected routes (admin, worker, or citizen)
  if (!requireAdmin && !requireWorker && !requireCitizen && !isAdmin && !isWorker && !isCitizen) {
    console.warn("Blocked unauthorized access. Redirecting...");
    return <Navigate to="/user-login" replace />;
  }

  return children;
}
