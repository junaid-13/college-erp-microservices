import { useState } from "react";

import {
  validateDepartment,
  DURATION_BY_CODE,
  normalizeCode,
} from "../utils/departmentHelpers";

const EMPTY = { name: "", code: "", durationYears: "", departmentType: "UG" };

/**
 * Reusable department create/edit form (Task 3.16).
 * Fields: Name, Code, Duration, Type.
 */
export default function DepartmentForm({
  initial,
  onSubmit,
  submitLabel = "Save",
}) {
  const [form, setForm] = useState({ ...EMPTY, ...(initial || {}) });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(key, value) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-fill the known duration when a recognized code is entered.
      if (key === "code") {
        const expected = DURATION_BY_CODE[normalizeCode(value)];
        if (expected !== undefined) next.durationYears = expected;
      }
      return next;
    });
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    const e = validateDepartment(form);
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        durationYears: Number(form.durationYears),
      });
    } catch (err) {
      setServerError(err.response?.data?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="error-banner">{serverError}</div>}
      <fieldset>
        <legend>Department</legend>
        <label>
          Department Name
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>
          Department Code
          <input
            value={form.code}
            onChange={(e) => set("code", e.target.value)}
          />
          {errors.code && <span className="field-error">{errors.code}</span>}
        </label>
        <label>
          Duration (years)
          <input
            type="number"
            value={form.durationYears}
            onChange={(e) => set("durationYears", e.target.value)}
          />
          {errors.durationYears && (
            <span className="field-error">{errors.durationYears}</span>
          )}
        </label>
        <label>
          Department Type
          <select
            value={form.departmentType}
            onChange={(e) => set("departmentType", e.target.value)}
          >
            <option value="UG">UG</option>
            <option value="PG">PG</option>
          </select>
        </label>
      </fieldset>
      <button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
