import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Restrict a route to specific roles.
 *
 * Usage:
 *   <RoleGuard allow={['ADMIN']}><AdminDashboard /></RoleGuard>
 *   <Route element={<RoleGuard allow={['HOD']} />}>...</Route>
 *
 * Unauthorized roles are redirected to /unauthorized.
 */
export default function RoleGuard({ allow = [], children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  console.log("RoleGuard: user role is allowed")
  return children ? children : <Outlet />;
}
