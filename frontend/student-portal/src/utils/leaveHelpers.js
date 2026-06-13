/**
 * Pure helpers shared by the leave UI (mirrors backend calculator).
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function dayOnly(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Inclusive day count. 10-Jan to 12-Jan = 3. */
export function calculateDays(fromDate, toDate) {
  if (!fromDate || !toDate) return 0;
  const from = dayOnly(fromDate);
  const to = dayOnly(toDate);
  if (to < from) return 0;
  return Math.round((to - from) / MS_PER_DAY) + 1;
}

/** Validate an apply-leave form. */
export function validateLeave(form) {
  const e = {};
  if (!form.leaveType) e.leaveType = "Leave type is required";
  if (!form.fromDate) e.fromDate = "From date is required";
  if (!form.toDate) e.toDate = "To date is required";
  if (!form.reason || !form.reason.trim()) e.reason = "Reason is required";
  if (
    form.fromDate &&
    form.toDate &&
    dayOnly(form.toDate) < dayOnly(form.fromDate)
  ) {
    e.toDate = "To date must be on or after from date";
  }
  return e;
}

/** CSS class for a leave status badge. */
export function statusClass(status) {
  return `flag flag-${status}`;
}

/** Percentage breakdown for analytics. */
export function statusBreakdown(analytics) {
  const total = analytics.total || 0;
  const pct = (n) => (total === 0 ? 0 : Math.round((n / total) * 100));
  return {
    approvedPct: pct(analytics.approved || 0),
    rejectedPct: pct(analytics.rejected || 0),
    pendingPct: pct(analytics.pending || 0),
  };
}
