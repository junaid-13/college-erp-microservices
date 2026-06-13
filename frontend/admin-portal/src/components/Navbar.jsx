import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import notificationService from "../services/notificationService";

import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <span className="brand">🎓 College ERP</span>
      <Link to="/departments" style={{ marginLeft: "1rem" }}>
        Departments
      </Link>
      <Link to="/notifications/dashboard" style={{ marginLeft: "0.75rem" }}>
        Notif Analytics
      </Link>
      <Link to="/notification-preferences" style={{ marginLeft: "0.75rem" }}>
        Prefs
      </Link>
      <span className="spacer" />
      <NotificationBell
        service={notificationService}
        centerPath="/notifications"
      />
      <span className="who" style={{ marginLeft: "0.75rem" }}>
        {user.email} <em>({user.role})</em>
      </span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
