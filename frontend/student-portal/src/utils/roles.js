export const DASHBOARD_BY_ROLE = {
  ADMIN: "/admin",
  HOD: "/hod",
  FACULTY: "/faculty",
  STUDENT: "/student",
};

/** Resolve the landing route for a given role. */
export function dashboardFor(role) {
  return DASHBOARD_BY_ROLE[role] || "/login";
}

/** Whether a role is permitted given an allow-list. */
export function canAccess(role, allow = []) {
  return allow.includes(role);
}
