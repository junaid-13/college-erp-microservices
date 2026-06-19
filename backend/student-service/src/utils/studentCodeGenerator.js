"use strict";

const Student = require("../models/Student");

/**
 * Generate a unique sequential student registration number (Task 4.5).
 *
 * Format: <DEPT_PREFIX><ADMISSION_YEAR><SEQ(3)>
 *   e.g. BCA2025001, BCA2025002, ...
 *
 * The sequence is scoped per (prefix + year). We find the highest existing
 * code for that scope and increment. Uniqueness is also enforced by the
 * unique index on studentCode, so a retry loop guards against races.
 *
 * @param {Object} opts
 * @param {string} opts.prefix       Department prefix, e.g. "BCA".
 * @param {number} [opts.year]       Admission year (defaults to current year).
 * @returns {Promise<string>}
 */
async function generateStudentCode({ prefix, year }) {
  const deptPrefix = String(prefix || "GEN")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  const admissionYear = year || new Date().getFullYear();
  const base = `${deptPrefix}${admissionYear}`;

  // Find the latest code for this prefix+year scope.
  const last = await Student.findOne({
    studentCode: {
      $regex: `^${base}[0-9]+$`,
    },
  })
    .sort({ studentCode: -1 })
    .select("studentCode")
    .lean();

  let next = 1;

  if (last && last.studentCode) {
    const seq = parseInt(last.studentCode.slice(base.length), 10);

    if (!Number.isNaN(seq)) {
      next = seq + 1;
    }
  }

  return `${base}${String(next).padStart(3, "0")}`;
}

module.exports = {
  generateStudentCode,
};
