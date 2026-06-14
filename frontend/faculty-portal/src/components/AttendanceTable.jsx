import { useState } from "react";

const STATUSES = ["PRESENT", "ABSENT", "LEAVE", "OD"];

/**
 * Bulk attendance table (Task 8.24).
 * Renders a student list with a per-student status selector and bulk save.
 *
 * @param {Array<{_id, label}>} students
 * @param {(entries:Array)=>Promise} onSave  receives [{studentId, status}]
 */
export default function AttendanceTable({ students = [], onSave }) {
  const [marks, setMarks] = useState(() =>
    Object.fromEntries(students.map((s) => [s._id, "PRESENT"])),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function set(id, status) {
    setMarks((m) => ({ ...m, [id]: status }));
  }

  function setAll(status) {
    setMarks(Object.fromEntries(students.map((s) => [s._id, status])));
  }

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const entries = students.map((s) => ({
        studentId: s._id,
        status: marks[s._id] || "PRESENT",
      }));
      const res = await onSave(entries);
      setMessage(
        `Saved ${res?.created ?? entries.length} record(s)${res?.duplicates ? `, ${res.duplicates} duplicate(s) skipped` : ""}.`,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!students.length) return <p>No students to mark.</p>;

  return (
    <div>
      <div className="att-btns" style={{ margin: "0.5rem 0" }}>
        <button type="button" onClick={() => setAll("PRESENT")}>
          All Present
        </button>
        <button type="button" onClick={() => setAll("ABSENT")}>
          All Absent
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.label || s._id}</td>
              <td>
                <select
                  value={marks[s._id]}
                  onChange={(e) => set(s._id, e.target.value)}
                >
                  {STATUSES.map((st) => (
                    <option key={st}>{st}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      <button onClick={save} disabled={saving} style={{ marginTop: "0.75rem" }}>
        {saving ? "Saving…" : "Save Attendance"}
      </button>
    </div>
  );
}
