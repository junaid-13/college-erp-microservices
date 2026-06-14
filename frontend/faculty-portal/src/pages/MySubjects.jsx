import { useEffect, useState } from "react";

import subjectService from "../services/subjectService";

/**
 * Faculty view of assigned subjects (Task 6.26). Read-only.
 */
export default function MySubjects() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectService
      .getFacultySubjects()
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
              <th>Semester</th>
              <th>Credits</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s._id}>
                <td>{s.subjectCode}</td>
                <td>{s.subjectName}</td>
                <td>{s.semester}</td>
                <td>{s.credits}</td>
              </tr>
            ))}
            {!subjects.length && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No subjects assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
