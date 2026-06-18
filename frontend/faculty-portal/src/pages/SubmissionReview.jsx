import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

import assessmentService from "../services/assessmentService";
import { validateGrade } from "../utils/assessmentHelpers";

function SubmissionRow({ s, setDraft, grade }) {
  return (
    <tr>
      <td>
        {s.studentId}
        <br />
        <small>{s.studentEmail}</small>
      </td>
      <td>
        {s.submittedAt ? new Date(s.submittedAt).toLocaleString() : "—"}
        {s.isLate ? " (late)" : ""}
      </td>
      <td>
        {s.submissionUrl ? (
          <a href={s.submissionUrl} target="_blank" rel="noreferrer">
            View
          </a>
        ) : (
          "—"
        )}
      </td>
      <td>
        <span className={`flag flag-${s.status}`}>{s.status}</span>
      </td>
      <td>
        <input
          type="number"
          style={{ width: "70px" }}
          defaultValue={s.marksObtained ?? ""}
          onChange={(e) => setDraft(s._id, "marks", e.target.value)}
        />
      </td>
      <td>
        <input
          defaultValue={s.feedback ?? ""}
          onChange={(e) => setDraft(s._id, "feedback", e.target.value)}
        />
      </td>
      <td>
        <button onClick={() => grade(s)}>Save</button>
      </td>
    </tr>
  );
}

function SubmissionTable({ subs, setDraft, grade }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Submitted</th>
          <th>File</th>
          <th>Status</th>
          <th>Marks</th>
          <th>Feedback</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {subs.map((s) => (
          <SubmissionRow key={s._id} s={s} setDraft={setDraft} grade={grade} />
        ))}

        {!subs.length && (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              No submissions yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default function SubmissionReview() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [subs, setSubs] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [a, s] = await Promise.all([
        assessmentService.getAssessment(id),
        assessmentService.getSubmissions(id),
      ]);

      setAssessment(a.data);
      setSubs(s.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const setDraft = (subId, key, value) =>
    setDrafts((d) => ({ ...d, [subId]: { ...d[subId], [key]: value } }));

  async function grade(sub) {
    const draft = drafts[sub._id] ?? {};
    const marks = draft.marks ?? sub.marksObtained ?? "";

    const validationError = validateGrade(marks, assessment?.maxMarks);
    if (validationError) return setError(validationError);

    try {
      await assessmentService.gradeSubmission(sub._id, {
        marksObtained: Number(marks),
        feedback: draft.feedback ?? sub.feedback ?? "",
      });

      load();
    } catch (e) {
      setError(e.response?.data?.message || "Grading failed");
    }
  }

  if (loading) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <h2>Submissions — {assessment?.title}</h2>

      <p>
        Max marks: {assessment?.maxMarks} ·{" "}
        <Link to="/assessments">← Back</Link>
      </p>

      {error && <div className="error-banner">{error}</div>}

      <SubmissionTable subs={subs} setDraft={setDraft} grade={grade} />
    </div>
  );
}
