import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import ApplyLeave from "./pages/ApplyLeave";
import Assessments from "./pages/Assessments";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import Library from "./pages/Library";
import Login from "./pages/Login";
import MarkAttendance from "./pages/MarkAttendance";
import MarksEntry from "./pages/MarksEntry";
import MyBooks from "./pages/MyBooks";
import MyLeaves from "./pages/MyLeaves";
import MyProfile from "./pages/MyProfile";
import MySubjects from "./pages/MySubjects";
import MyTimetable from "./pages/MyTimetable";
import SalarySlips from "./pages/SalarySlips";
import SubmissionReview from "./pages/SubmissionReview";
import Unauthorized from "./pages/Unauthorized";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          {/* Self-profile is FACULTY only. */}
          <Route element={<RoleGuard allow={["FACULTY"]} />}>
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/subjects" element={<MySubjects />} />
            <Route path="/timetable" element={<MyTimetable />} />
            <Route path="/attendance/mark" element={<MarkAttendance />} />
            <Route path="/attendance" element={<AttendanceDashboard />} />
            <Route path="/marks" element={<MarksEntry />} />
            <Route path="/leave/apply" element={<ApplyLeave />} />
            <Route path="/leaves" element={<MyLeaves />} />
            <Route path="/library" element={<Library />} />
            <Route path="/books" element={<MyBooks />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route
              path="/assessments/:id/submissions"
              element={<SubmissionReview />}
            />
            <Route path="/salary-slips" element={<SalarySlips />} />
          </Route>
          <Route path="/" element={<Navigate to="/profile" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
