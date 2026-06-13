import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="page">
      <h2>403 — Unauthorized</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/">Go home</Link>
    </div>
  );
}
