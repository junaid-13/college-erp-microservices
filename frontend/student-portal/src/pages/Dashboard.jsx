import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

/**
 * Generic role dashboard. The same component renders for each role,
 * parameterized by title — guarded by RoleGuard at the route level.
 */
export default function Dashboard({ title }) {
  const { user } = useAuth();
  return (
    <div className="page">
      <h2>{title}</h2>
      <p>
        Welcome, <strong>{user?.email}</strong>.
      </p>
      <p>
        Your role is <code>{user?.role}</code>. This area is restricted to your
        role only.
      </p>
      {user?.role === "STUDENT" && (
        <p>
          <Link className="btn" to="/student/profile">
            View My Profile
          </Link>{" "}
          <Link className="btn" to="/student/subjects">
            View My Subjects
          </Link>{" "}
          <Link className="btn" to="/student/timetable">
            View My Timetable
          </Link>{" "}
          <Link className="btn" to="/student/attendance">
            View My Attendance
          </Link>{" "}
          <Link className="btn" to="/student/results">
            View My Results
          </Link>{" "}
          <Link className="btn" to="/student/leave/apply">
            Apply Leave
          </Link>{" "}
          <Link className="btn" to="/student/leaves">
            My Leaves
          </Link>{" "}
          <Link className="btn" to="/student/library">
            Library
          </Link>{" "}
          <Link className="btn" to="/student/books">
            My Books
          </Link>{" "}
          <Link className="btn" to="/student/assessments">
            My Assessments
          </Link>{" "}
          <Link className="btn" to="/student/notifications">
            Notifications
          </Link>{" "}
          <Link className="btn" to="/student/notification-preferences">
            Notification Prefs
          </Link>
        </p>
      )}
    </div>
  );
}
