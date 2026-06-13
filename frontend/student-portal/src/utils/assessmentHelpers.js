/**
 * Pure helpers shared by the assessment UI.
 */

/** True when now is past the due date. */
export function isPastDue(dueDate, now = new Date()) {
  return new Date(now).getTime() > new Date(dueDate).getTime();
}

/** Human submission state for a student given their submission + assessment. */
export function submissionStatus(submission, assessment) {
  if (!submission) return isPastDue(assessment.dueDate) ? "MISSED" : "PENDING";
  if (submission.status === "GRADED") return "GRADED";
  if (submission.isLate || submission.status === "LATE") return "LATE";
  return "SUBMITTED";
}

/** Validate the assessment form. */
export function validateAssessment(form) {
  const e = {};
  if (!form.title || !form.title.trim()) e.title = "Title is required";
  if (!form.subjectId || !/^[0-9a-fA-F]{24}$/.test(form.subjectId))
    e.subjectId = "Valid subject id required";
  if (!form.dueDate) e.dueDate = "Due date is required";
  if (!form.maxMarks || Number(form.maxMarks) < 1)
    e.maxMarks = "Max marks must be greater than 0";
  return e;
}

/** Validate a grade entry against the assessment max. */
export function validateGrade(marks, maxMarks) {
  if (marks === "" || marks == null) return "Marks required";
  const n = Number(marks);
  if (Number.isNaN(n)) return "Must be a number";
  if (n < 0) return "Cannot be negative";
  if (maxMarks != null && n > Number(maxMarks))
    return `Cannot exceed ${maxMarks}`;
  return "";
}
