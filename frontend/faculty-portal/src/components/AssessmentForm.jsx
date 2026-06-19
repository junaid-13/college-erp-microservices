import { useState } from "react";

import { validateAssessment } from "../utils/assessmentHelpers";

const EMPTY = {
  title: "",
  description: "",
  subjectId: "",
  semester: "",
  maxMarks: 20,
  dueDate: "",
  allowResubmission: false,
  assessmentType: "ASSIGNMENT",
  weightage: 0,
};

const TYPES = ["ASSIGNMENT", "QUIZ", "PROJECT", "LAB", "INTERNAL"];

/**
 * Reusable assessment create/edit form (Task 13.27).
 */

function BasicFields({ form, errors, set }) {
  return (
    <>
      <label>
        Title
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>

      <label>
        Subject ID
        <input
          value={form.subjectId}
          onChange={(e) => set("subjectId", e.target.value)}
        />
        {errors.subjectId && (
          <span className="field-error">{errors.subjectId}</span>
        )}
      </label>

      <label>
        Max Marks
        <input
          type="number"
          value={form.maxMarks}
          onChange={(e) => set("maxMarks", e.target.value)}
        />
        {errors.maxMarks && (
          <span className="field-error">{errors.maxMarks}</span>
        )}
      </label>

      <label>
        Due Date
        <input
          type="datetime-local"
          value={form.dueDate}
          onChange={(e) => set("dueDate", e.target.value)}
        />
        {errors.dueDate && (
          <span className="field-error">{errors.dueDate}</span>
        )}
      </label>
    </>
  );
}

function AdvancedFields({ form, set }) {
  return (
    <>
      <label>
        Semester
        <input
          type="number"
          value={form.semester}
          onChange={(e) => set("semester", e.target.value)}
        />
      </label>

      <label>
        Type
        <select
          value={form.assessmentType}
          onChange={(e) => set("assessmentType", e.target.value)}
        >
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label>
        Weightage (%)
        <input
          type="number"
          value={form.weightage}
          onChange={(e) => set("weightage", e.target.value)}
        />
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={form.allowResubmission}
          onChange={(e) => set("allowResubmission", e.target.checked)}
        />
        Allow resubmission
      </label>

      <label style={{ gridColumn: "1 / -1" }}>
        Description
        <textarea
          rows="2"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </label>
    </>
  );
}

export default function AssessmentForm({
  initial,
  onSubmit,
  submitLabel = "Save",
}) {
  const [form, setForm] = useState({ ...EMPTY, ...(initial || {}) });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    setServerError("");

    const e = validateAssessment(form);
    setErrors(e);

    if (Object.keys(e).length) return;

    setSubmitting(true);

    try {
      await onSubmit({
        ...form,
        maxMarks: Number(form.maxMarks),
        semester: form.semester ? Number(form.semester) : undefined,
        weightage: form.weightage ? Number(form.weightage) : 0,
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
        <legend>Assessment</legend>

        <BasicFields form={form} errors={errors} set={set} />

        <AdvancedFields form={form} set={set} />
      </fieldset>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
