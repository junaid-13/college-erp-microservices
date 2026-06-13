import { useEffect, useState } from "react";

import marksService from "../services/marksService";

/**
 * Student results page (Task 9.29). Only published marks are visible (the
 * backend filters to PUBLISHED).
 */
export default function MyResults() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marksService
      .getSelfResults()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load results"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading…</div>;
  if (error) return <div className="page error-banner">{error}</div>;
  if (!data) return <div className="page">No data.</div>;

  return (
    <div className="page">
      <h2>My Results</h2>

      <section className="detail-block">
        <h3>Summary</h3>
        <p>
          Percentage: <strong>{data.percentage}%</strong> · Result:{" "}
          <span
            className={`flag flag-${data.result === "PASS" ? "PUBLISHED" : "CRITICAL"}`}
          >
            {data.result}
          </span>
        </p>
        <p>
          GPA: <strong>{data.gpa}</strong> · CGPA: <strong>{data.cgpa}</strong>
        </p>
      </section>

      <section className="detail-block">
        <h3>Subject-wise</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>%</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {data.subjects.map((s, i) => (
              <tr key={`${s.subjectId}-${i}`}>
                <td>{s.subjectId}</td>
                <td>
                  {s.marksObtained}/{s.maxMarks}
                </td>
                <td>{s.percentage}%</td>
                <td>{s.grade}</td>
              </tr>
            ))}
            {!data.subjects.length && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No published results yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
