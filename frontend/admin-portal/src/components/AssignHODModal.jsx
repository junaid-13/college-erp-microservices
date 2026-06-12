import { useState } from "react";

import departmentService from "../services/departmentService";

/**
 * Modal to assign a HOD to a department (Task 3.17).
 *
 * The auth-service has no public "list HODs" endpoint yet, so the admin
 * enters the HOD's faculty/user id directly. The backend validates that the
 * id exists and has the HOD role.
 */
export default function AssignHODModal({ department, onClose, onAssigned }) {
  const [hodId, setHodId] = useState(department.hodId || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setError("");
    setMessage("");
    if (!/^[0-9a-fA-F]{24}$/.test(hodId.trim())) {
      setError("Please enter a valid HOD user id.");
      return;
    }
    setSaving(true);
    try {
      await departmentService.assignHOD(department._id, hodId.trim());
      setMessage("HOD assigned successfully.");
      onAssigned && onAssigned();
    } catch (err) {
      setError(err.response?.data?.message || "Assignment failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Assign HOD — {department.name}</h3>
        <label>
          HOD User ID
          <input
            value={hodId}
            onChange={(e) => setHodId(e.target.value)}
            placeholder="24-char user id"
          />
        </label>
        {error && <div className="error-banner">{error}</div>}
        {message && <div className="success-banner">{message}</div>}
        <div className="modal-actions">
          <button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save Assignment"}
          </button>
          <button className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
