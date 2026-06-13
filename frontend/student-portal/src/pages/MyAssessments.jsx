import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import assessmentService from "../services/assessmentService";
import { isPastDue } from "../utils/assessmentHelpers";

/**
 * Student assessment list (Task 13.28). Published assessments only (enforced
 * server-side), with due date, attachment download, and submission status.
 */
export default function MyAssessments() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentService
      .getAssessments()
      .then((res) => setItems(res.data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load assessments"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading…</div>;
  if (error) return <div className="page error-banner">{error}</div>;

  return (
    <div className="page">
      <h2>My Assessments</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Max</th>
            <th>Due</th>
            <th>Attachment</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a._id}>
              <td>{a.title}</td>
              <td>{a.description}</td>
              <td>{a.maxMarks}</td>
              <td>
                {a.dueDate ? new Date(a.dueDate).toLocaleString() : "—"}
                {isPastDue(a.dueDate) ? " (past due)" : ""}
              </td>
              <td>
                {a.attachmentUrl ? (
                  <a href={a.attachmentUrl} target="_blank" rel="noreferrer">
                    Download
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td>
                <Link
                  className="btn"
                  to={`/student/assessments/${a._id}/submit`}
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
          {!items.length && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No assessments yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
