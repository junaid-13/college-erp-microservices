"use strict";

/**
 * Academic year/semester rules (Task 4.17).
 *
 * Each program defines how many years it runs; semesters map two-per-year:
 *   Year 1 -> Semesters 1,2
 *   Year 2 -> Semesters 3,4
 *   Year N -> Semesters (2N-1), (2N)
 *
 * `maxYears` lets us reject out-of-range years per program.
 */
const PROGRAMS = {
  BCA: { maxYears: 3 },
  ENGINEERING: { maxYears: 4 },
  DEFAULT: { maxYears: 4 },
};

/**
 * Valid semesters for a given year.
 * @param {number} year
 * @returns {number[]} e.g. year 2 -> [3, 4]
 */
function semestersForYear(year) {
  return [year * 2 - 1, year * 2];
}

/**
 * Validate that a (year, semester) pair is internally consistent and within
 * the program's allowed range.
 *
 * @param {number} year
 * @param {number} semester
 * @param {string} [program] program key (BCA, ENGINEERING, ...)
 * @returns {{ valid: boolean, message?: string }}
 */
function validateYearSemester(year, semester, program = "DEFAULT") {
  const cfg =
    PROGRAMS[(program || "DEFAULT").toUpperCase()] || PROGRAMS.DEFAULT;

  if (!Number.isInteger(year) || year < 1 || year > cfg.maxYears) {
    return {
      valid: false,
      message: `Year must be between 1 and ${cfg.maxYears}`,
    };
  }

  const allowed = semestersForYear(year);
  if (!allowed.includes(semester)) {
    return {
      valid: false,
      message: `Semester ${semester} is invalid for year ${year}. Allowed: ${allowed.join(", ")}`,
    };
  }

  return { valid: true };
}

module.exports = { PROGRAMS, semestersForYear, validateYearSemester };
