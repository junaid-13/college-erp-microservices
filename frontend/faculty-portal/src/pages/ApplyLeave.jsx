import { useState } from "react";

import leaveService from "../services/leaveService";
import { validateLeave, calculateDays } from "../utils/leaveHelpers";

const LEAVE_TYPES = ["CASUAL", "MEDICAL", "EARNED", "ON_DUTY", "OTHER"];

/**
 * Apply for leave (Task 10.22). Shared between student & faculty portals.
 */

function LeaveFormFields({ form, errors, days, set, setFile }) {
  return (
    <fieldset>
      <legend>Leave Details</legend>

      <label>
        Leave Type
        <select
          value={form.leaveType}
          onChange={(e) => set("leaveType", e.target.value)}
        >
          {LEAVE_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {errors.leaveType && (
          <span className="field-error">{errors.leaveType}</span>
        )}
      </label>

      <label>
        From Date
        <input
          type="date"
          value={form.fromDate}
          onChange={(e) => set("fromDate", e.target.value)}
        />
        {errors.fromDate && (
          <span className="field-error">{errors.fromDate}</span>
        )}
      </label>

      <label>
        To Date
        <input
          type="date"
          value={form.toDate}
          onChange={(e) => set("toDate", e.target.value)}
        />
        {errors.toDate && <span className="field-error">{errors.toDate}</span>}
      </label>

      <label>
        Days
        <input value={days || ""} readOnly />
      </label>

      <label style={{ gridColumn: "1 / -1" }}>
        Reason
        <textarea
          rows="2"
          value={form.reason}
          onChange={(e) => set("reason", e.target.value)}
        />
        {errors.reason && <span className="field-error">{errors.reason}</span>}
      </label>

      <label style={{ gridColumn: "1 / -1" }}>
        Attachment (PDF/JPG/PNG)
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>
    </fieldset>
  );
}

export default function ApplyLeave() {
  const [form, setForm] = useState({
    leaveType: "CASUAL",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    setServerError("");
    setMessage("");

    const e = validateLeave(form);
    setErrors(e);

    if (Object.keys(e).length) return;

    setSubmitting(true);

    try {
      let attachmentUrl = "";

      if (file) {
        try {
          const up = await leaveService.uploadAttachment(file);
          attachmentUrl = up.attachmentUrl;
        } catch (_) {
          setServerError("Attachment upload skipped (storage not configured).");
        }
      }

      await leaveService.applyLeave({ ...form, attachmentUrl });

      setMessage("Leave request submitted. Status: PENDING.");
      setForm({
        leaveType: "CASUAL",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      setFile(null);
    } catch (err) {
      setServerError(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  const days = calculateDays(form.fromDate, form.toDate);

  return (
    <div className="page">
      <h2>Apply for Leave</h2>

      <form className="student-form" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="error-banner">{serverError}</div>}
        {message && <div className="success-banner">{message}</div>}

        <LeaveFormFields
          form={form}
          errors={errors}
          days={days}
          set={set}
          setFile={setFile}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Leave Request"}
        </button>
      </form>
    </div>
  );
}
