import { useEffect, useState } from "react";

import subjectService from "../services/subjectService";

/**
 * Student view of semester subjects (Task 6.27). Read-only.
 * The backend resolves department/year/semester from the student's profile.
 */
export default function MySubjects() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectService
      .getStudentSubjects()
      .then((res) => setSubjects(res.data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load subjects"),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h2>My Subjects</h2>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Credits</th>
              <th>Faculty</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s._id}>
                <td>{s.subjectCode}</td>
                <td>{s.subjectName}</td>
                <td>{s.credits}</td>
                <td>{s.facultyId || "—"}</td>
              </tr>
            ))}
            {!subjects.length && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No subjects found for your semester.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
