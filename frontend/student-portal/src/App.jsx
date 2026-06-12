import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import ApplyLeave from "./pages/ApplyLeave";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Login from "./pages/Login";
import MyAssessments from "./pages/MyAssessments";
import MyAttendance from "./pages/MyAttendance";
import MyBooks from "./pages/MyBooks";
import MyLeaves from "./pages/MyLeaves";
import MyProfile from "./pages/MyProfile";
import MyResults from "./pages/MyResults";
import MySubjects from "./pages/MySubjects";
import MyTimetable from "./pages/MyTimetable";
import NotificationPreferences from "./pages/NotificationPreferences";
import Notifications from "./pages/Notifications";
import SubmissionHistory from "./pages/SubmissionHistory";
import SubmitAssessment from "./pages/SubmitAssessment";
import Unauthorized from "./pages/Unauthorized";
import notificationService from "./services/notificationService";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        {/* Every student route is restricted to the STUDENT role. */}
        <Route element={<RoleGuard allow={["STUDENT"]} />}>
          <Route
            path="/student"
            element={<Dashboard title="Student Dashboard" />}
          />
          <Route path="/student/profile" element={<MyProfile />} />
          <Route path="/student/subjects" element={<MySubjects />} />
          <Route path="/student/timetable" element={<MyTimetable />} />
          <Route path="/student/attendance" element={<MyAttendance />} />
          <Route path="/student/results" element={<MyResults />} />
          <Route path="/student/leave/apply" element={<ApplyLeave />} />
          <Route path="/student/leaves" element={<MyLeaves />} />
          <Route path="/student/library" element={<Library />} />
          <Route path="/student/books" element={<MyBooks />} />
          <Route path="/student/assessments" element={<MyAssessments />} />
          <Route
            path="/student/assessments/:id/submit"
            element={<SubmitAssessment />}
          />
          <Route
            path="/student/assessments/:id/history"
            element={<SubmissionHistory />}
          />
          <Route
            path="/student/notifications"
            element={<Notifications service={notificationService} />}
          />
          <Route
            path="/student/notification-preferences"
            element={<NotificationPreferences service={notificationService} />}
          />
        </Route>
        <Route path="/" element={<Navigate to="/student" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
