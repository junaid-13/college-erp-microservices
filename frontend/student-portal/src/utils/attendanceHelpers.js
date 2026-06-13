/**
 * Pure helpers shared by the attendance UI (mirrors backend calculator).
 */

export const PRESENT_EQUIVALENT = ["PRESENT", "OD"];

export function calculatePercentage(records = []) {
  const total = records.length;
  const present = records.filter((r) =>
    PRESENT_EQUIVALENT.includes(r.status),
  ).length;
  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);
  return { total, present, percentage };
}

export function attendanceFlag(percentage) {
  if (percentage < 65) return "CRITICAL";
  if (percentage < 75) return "WARNING";
  return "OK";
}

/** CSS class for a flag badge. */
export function flagClass(flag) {
  return `flag flag-${flag}`;
}

/** Build the API query object from filters, dropping empties. */
export function buildQuery(filters = {}) {
  const params = {};
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== "" && v != null) params[k] = v;
  });
  return params;
}
