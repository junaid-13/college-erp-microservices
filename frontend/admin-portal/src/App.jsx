import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import Departments from "./pages/Departments";
import Login from "./pages/Login";
import NotificationDashboard from "./pages/NotificationDashboard";
import NotificationPreferences from "./pages/NotificationPreferences";
import Notifications from "./pages/Notifications";
import Unauthorized from "./pages/Unauthorized";
import notificationService from "./services/notificationService";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          {/* Department management is ADMIN only. */}
          <Route element={<RoleGuard allow={["ADMIN"]} />}>
            <Route path="/departments" element={<Departments />} />
            <Route
              path="/notifications/dashboard"
              element={<NotificationDashboard />}
            />
          </Route>

          {/* Notification center + preferences for any authenticated user. */}
          <Route
            path="/notifications"
            element={<Notifications service={notificationService} />}
          />
          <Route
            path="/notification-preferences"
            element={<NotificationPreferences service={notificationService} />}
          />

          <Route path="/" element={<Navigate to="/departments" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
