"use strict";

/**
 * Centralized environment loading + validation.
 *
 * Loads variables from a .env file (via dotenv if available) and validates
 * that all required keys are present, throwing a startup error otherwise.
 *
 * @param {Object} [options]
 * @param {string[]} [options.required] Required env var names.
 * @returns {NodeJS.ProcessEnv}
 */
function loadEnv(options = {}) {
  try {
    // dotenv is optional; each service depends on it. Load .env if present.
    require("dotenv").config();
  } catch (_) {
    // dotenv not installed — assume env is provided by the runtime/PM2.
  }

  const required = options.required || [];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  return process.env;
}

module.exports = loadEnv;
