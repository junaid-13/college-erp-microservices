import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import assessmentService from "../services/assessmentService";

/**
 * Student submission history (Task 13.31).
 * Attempt number, date, status, marks, feedback.
 */
export default function SubmissionHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      assessmentService.getSubmissionHistory(id),
      assessmentService.getMySubmission(id),
    ])
      .then(([h, s]) => {
        setHistory(h.data || []);
        setSubmission(s.data);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load history"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page">Loading…</div>;
  if (error) return <div className="page error-banner">{error}</div>;

  return (
    <div className="page">
      <h2>Submission History</h2>
      <p>
        <Link to={`/student/assessments/${id}/submit`}>
          ← Back to assessment
        </Link>
      </p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Attempt</th>
            <th>Submitted</th>
            <th>Late?</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h._id}>
              <td>#{h.attemptNumber}</td>
              <td>
                {h.submittedAt ? new Date(h.submittedAt).toLocaleString() : "—"}
              </td>
              <td>{h.isLate ? "Yes" : "No"}</td>
              <td>
                {h.submissionUrl ? (
                  <a href={h.submissionUrl} target="_blank" rel="noreferrer">
                    View
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
          {!history.length && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No submissions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {submission && submission.status === "GRADED" && (
        <section className="detail-block">
          <h3>Latest Grade</h3>
          <p>
            Marks: <strong>{submission.marksObtained}</strong>
          </p>
          <p>Feedback: {submission.feedback || "—"}</p>
        </section>
      )}
    </div>
  );
}
