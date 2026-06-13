"use strict";

const logger = require("../logger/logger");

/**
 * 404 handler — for routes that did not match.
 */
function notFoundHandler(req, res, _next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Centralized error handler. Standardizes validation and internal errors.
 *
 * Usage: register LAST, after all routes:
 *   app.use(notFoundHandler);
 *   app.use(errorHandler);
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Mongoose / validation errors -> 400 with field details.
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  // Errors with an explicit status (thrown intentionally).
  if (err.status && err.status < 500) {
    return res.status(err.status).json({
      success: false,
      message: err.message || "Request Error",
    });
  }

  // Anything else -> 500.
  logger.error(err.stack || err.message || String(err));
  return res.status(err.status || 500).json({
    success: false,
    message: "Internal Server Error",
  });
}

module.exports = errorHandler;
module.exports.notFoundHandler = notFoundHandler;
module.exports.errorHandler = errorHandler;
