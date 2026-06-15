import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const DASHBOARD_BY_ROLE = {
  ADMIN: "/admin",
  HOD: "/hod",
  FACULTY: "/faculty",
  STUDENT: "/student",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    const emailRegex = /^[A-Za-z]+(?:[._-][A-Za-z]+)*@[A-Za-z-]+\.edu$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[._@-])[A-Za-z\d][A-Za-z\d._@-]{6,}[A-Za-z\d]$/;

    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      e.email = "Enter a valid college email";
    }

    if (!password) {
      e.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      e.password =
        "Password must be atleast 8 characters, contain an uppercase letter, a lowercase letter, a number, and one of (. - _ @). It cannot start or end with a special character.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      const user = await login(email, password);
      const dest = location.state?.from || DASHBOARD_BY_ROLE[user.role] || "/";
      navigate(dest, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setErrors({ form: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>🎓 College ERP</h1>
        <p className="subtitle">Sign in to your account</p>

        {errors.form && <div className="error-banner">{errors.form}</div>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@college.edu"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••••"
          />
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
