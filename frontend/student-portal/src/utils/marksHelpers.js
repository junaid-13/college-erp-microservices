/**
 * Pure helpers shared by the marks UI (mirrors backend grade calculator).
 */

export function percentage(obtained, max) {
  if (!max || max <= 0) return 0;
  return Math.round((obtained / max) * 100);
}

export function gradeFromPercentage(pct) {
  if (pct >= 90) return "O";
  if (pct >= 80) return "A+";
  if (pct >= 70) return "A";
  if (pct >= 60) return "B+";
  if (pct >= 50) return "B";
  if (pct >= 40) return "C";
  return "F";
}

export function isPass(pct) {
  return pct >= 40;
}

/** CSS class for a grade badge. */
export function gradeClass(grade) {
  return `grade grade-${grade === "+" ? "plus" : grade.replace("+", "plus")}`;
}

/** Validate a marks value against its max. */
export function validateMark(obtained, max) {
  if (obtained === "" || obtained == null) return "Marks required";
  const n = Number(obtained);
  if (Number.isNaN(n)) return "Must be a number";
  if (n < 0) return "Cannot be negative";
  if (max != null && n > Number(max)) return `Cannot exceed ${max}`;
  return "";
}
