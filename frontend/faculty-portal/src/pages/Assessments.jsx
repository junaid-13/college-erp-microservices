import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import AssessmentForm from "../components/AssessmentForm";
import assessmentService from "../services/assessmentService";

/**
 * Faculty assessment management (Task 13.26).
 * Create / update / publish + jump to submissions.
 */

function EditAssessment({ editing, handleUpdate, setEditing }) {
  if (!editing) return null;

  return (
    <div className="edit-block">
      <h3>Edit — {editing.title}</h3>

      <AssessmentForm
        initial={{
          ...editing,
          dueDate: editing.dueDate ? editing.dueDate.slice(0, 16) : "",
        }}
        onSubmit={handleUpdate}
        submitLabel="Update Assessment"
      />

      <button className="ghost" onClick={() => setEditing(null)}>
        Cancel edit
      </button>
    </div>
  );
}

function AssessmentsTable({ items, publish, setEditing, navigate, fmtDate }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Max</th>
          <th>Due</th>
          <th>Status</th>
          <th>Subs</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {items.map((a) => (
          <tr key={a._id}>
            <td>{a.title}</td>
            <td>{a.assessmentType}</td>
            <td>{a.maxMarks}</td>
            <td>{fmtDate(a.dueDate)}</td>

            <td>
              <span className={`flag flag-${a.status}`}>{a.status}</span>
            </td>

            <td>{a.submissionCount}</td>

            <td className="actions">
              <button onClick={() => setEditing(a)}>Edit</button>

              {a.status === "DRAFT" && (
                <button onClick={() => publish(a._id)}>Publish</button>
              )}

              <button
                onClick={() => navigate(`/assessments/${a._id}/submissions`)}
              >
                Submissions
              </button>
            </td>
          </tr>
        ))}

        {!items.length && (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              No assessments yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default function Assessments() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await assessmentService.getAssessments();
      setItems(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assessments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(payload) {
    await assessmentService.createAssessment(payload);
    setCreating(false);
    load();
  }

  async function handleUpdate(payload) {
    await assessmentService.updateAssessment(editing._id, payload);
    setEditing(null);
    load();
  }

  async function publish(id) {
    await assessmentService.publishAssessment(id);
    load();
  }

  const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "—");

  return (
    <div className="page">
      <div className="page-head">
        <h2>Assessments ({items.length})</h2>

        <button className="btn" onClick={() => setCreating((c) => !c)}>
          {creating ? "Close" : "+ New Assessment"}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {creating && (
        <AssessmentForm
          onSubmit={handleCreate}
          submitLabel="Create Assessment"
        />
      )}

      <EditAssessment
        editing={editing}
        handleUpdate={handleUpdate}
        setEditing={setEditing}
      />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <AssessmentsTable
          items={items}
          publish={publish}
          setEditing={setEditing}
          navigate={navigate}
          fmtDate={fmtDate}
        />
      )}
    </div>
  );
}