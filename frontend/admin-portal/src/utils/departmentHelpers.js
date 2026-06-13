/**
 * Frontend mirror of the backend duration rules (Task 3.11) so the form can
 * pre-fill / pre-validate before hitting the API.
 */
export const DURATION_BY_CODE = {
  BCA: 3,
  BBA: 3,
  BBM: 3,
  BCOM: 3,
  MBA: 2,
  MCA: 2,
  MCOM: 2,
  CSE: 4,
  MECH: 4,
  CIVIL: 4,
  EEE: 4,
  DSE: 4,
  AIML: 4,
};

export function normalizeCode(code) {
  return String(code || "")
    .toUpperCase()
    .replace(/[.\s]/g, "");
}

/** Client-side validation for a department form. */
export function validateDepartment(form) {
  const e = {};
  if (!form.name || !form.name.trim()) e.name = "Name is required";
  if (!form.code || !form.code.trim()) e.code = "Code is required";
  if (!form.durationYears || Number(form.durationYears) < 1) {
    e.durationYears = "Duration must be greater than 0";
  } else {
    const expected = DURATION_BY_CODE[normalizeCode(form.code)];
    if (expected !== undefined && Number(form.durationYears) !== expected) {
      e.durationYears = `Invalid duration for ${form.code} (expected ${expected})`;
    }
  }
  return e;
}
