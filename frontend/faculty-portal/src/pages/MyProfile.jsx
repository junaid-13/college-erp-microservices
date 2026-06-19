import { useEffect, useState } from "react";

import facultyService from "../services/facultyService";

/**
 * Read-only self profile for faculty (Task 5.26).
 */
export default function MyProfile() {
  const [faculty, setFaculty] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    facultyService
      .getOwnProfile()
      .then((res) => setFaculty(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load profile"),
      );
  }, []);

  if (error) return <div className="page error-banner">{error}</div>;
  if (!faculty) return <div className="page">Loading…</div>;

  const { emergencyContact = {}, qualifications = [] } = faculty;

  return (
    <div className="page">
      <h2>My Profile</h2>

      <section className="detail-block">
        <h3>Personal</h3>
        <p>
          Name: {faculty.firstName} {faculty.lastName}
        </p>
        <p>Email: {faculty.email}</p>
        <p>Phone: {faculty.phone || "—"}</p>
        <p>Gender: {faculty.gender}</p>
      </section>

      <section className="detail-block">
        <h3>Employment</h3>
        <p>
          Employee ID: <strong>{faculty.employeeCode}</strong>
        </p>
        <p>Designation: {faculty.designation}</p>
        <p>Department: {faculty.departmentId}</p>
        <p>
          Joining Date:{" "}
          {faculty.joiningDate ? faculty.joiningDate.slice(0, 10) : "—"}
        </p>
        <p>Status: {faculty.status}</p>
      </section>

      <section className="detail-block">
        <h3>Qualifications</h3>
        {qualifications.length ? (
          <ul>
            {qualifications.map((q, i) => (
              <li key={i}>
                {q.degree}
                {q.specialization ? ` (${q.specialization})` : ""}
                {q.institution ? ` — ${q.institution}` : ""}
                {q.yearOfPassing ? `, ${q.yearOfPassing}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p>—</p>
        )}
      </section>

      <section className="detail-block">
        <h3>Emergency Contact</h3>
        <p>Name: {emergencyContact.name}</p>
        <p>Phone: {emergencyContact.phone}</p>
      </section>
    </div>
  );
}
