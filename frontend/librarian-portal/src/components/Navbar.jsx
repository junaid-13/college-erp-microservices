import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

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
      <span className="brand">📚 College ERP — Library</span>
      <Link to="/inventory" style={{ marginLeft: "1rem" }}>
        Inventory
      </Link>
      <Link to="/transactions" style={{ marginLeft: "0.75rem" }}>
        Issue / Return
      </Link>
      <Link to="/dashboard" style={{ marginLeft: "0.75rem" }}>
        Dashboard
      </Link>
      <span className="spacer" />
      <span className="who">
        {user.email} <em>({user.role})</em>
      </span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
