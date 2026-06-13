import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

/**
 * Allows logged-in users through; redirects guests to /login.
 * Use as a layout route wrapper or with explicit children.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children ? children : <Outlet />;
}
