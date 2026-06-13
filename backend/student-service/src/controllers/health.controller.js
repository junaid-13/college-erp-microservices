"use strict";

/**
 * Placeholder controller for student-service.
 * Business logic controllers will be added in later milestones.
 */
exports.health = (req, res) => {
  res.json({ status: "ok", service: "student-service" });
};
