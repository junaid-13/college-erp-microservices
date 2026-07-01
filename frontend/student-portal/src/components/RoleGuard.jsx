import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

/**
 * Restrict a route to specific roles.
 *
 * Usage:
 *   <RoleGuard allow={['ADMIN']}><AdminDashboard /></RoleGuard>
 *   <Route element={<RoleGuard allow={['HOD']} />}>...</Route>
 *
 * Unauthorized roles are redirected to /unauthorized.
 
export default function RoleGuard({ allow = [], children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children ? children : <Outlet />;
}
*/

export default function RoleGuard({ allow = [], children }) {
  const { user, isAuthenticated, loading } = useAuth();

  const allowedRoles = Array.isArray(allow) ? allow : [allow];
  const isAuthorized =
    allowedRoles.length === 0 || allowedRoles.includes(user?.role);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading…</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ?? <Outlet />;
}
