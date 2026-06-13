import { useEffect, useState } from "react";

import studentService from "../services/studentService";

/**
 * Read-only self profile for students (Task 4.25).
 */
export default function MyProfile() {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    studentService
      .getOwnProfile()
      .then((res) => setStudent(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load profile"),
      );
  }, []);

  if (error) return <div className="page error-banner">{error}</div>;
  if (!student) return <div className="page">Loading…</div>;

  const { guardian = {} } = student;

  return (
    <div className="page">
      <h2>My Profile</h2>

      <section className="detail-block">
        <h3>Personal</h3>
        <p>
          Name: {student.firstName} {student.lastName}
        </p>
        <p>Email: {student.email}</p>
        <p>Phone: {student.phone || "—"}</p>
        <p>Gender: {student.gender}</p>
      </section>

      <section className="detail-block">
        <h3>Academic</h3>
        <p>
          Reg. No: <strong>{student.studentCode}</strong>
        </p>
        <p>Department: {student.departmentId}</p>
        <p>
          Year {student.year} · Semester {student.semester} · Section{" "}
          {student.section}
        </p>
        <p>Status: {student.status}</p>
      </section>

      <section className="detail-block">
        <h3>Guardian</h3>
        <p>Name: {guardian.name}</p>
        <p>Relationship: {guardian.relationship || "—"}</p>
        <p>Phone: {guardian.phone}</p>
      </section>
    </div>
  );
}
