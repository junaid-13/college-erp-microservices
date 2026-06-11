"use strict";

/**
 * Role-based authorization middleware factory.
 *
 * Usage:
 *   authorize('ADMIN')
 *   authorize('ADMIN', 'HOD')
 *
 * Must run AFTER authenticate() (which sets req.user).
 *
 *  - req.user.role in allowed list -> next()
 *  - otherwise -> 403
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    return next();
  };
}

module.exports = authorize;
