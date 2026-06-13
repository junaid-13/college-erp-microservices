"use strict";

const cors = require("cors");

/**
 * Configurable CORS middleware.
 *
 * Allowed origins are read from the CORS_ORIGINS env var (comma-separated).
 * If CORS_ORIGINS is unset, defaults to the local Vite dev server.
 *
 * Requests from unlisted origins are blocked.
 *
 * @param {Object} [options]
 * @param {string[]} [options.origins] Explicit allowed origins (overrides env).
 * @returns {import('express').RequestHandler}
 */
function buildCors(options = {}) {
  const fromEnv = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const allowed =
    options.origins && options.origins.length ? options.origins : fromEnv;

  return cors({
    origin(origin, callback) {
      // Allow non-browser tools (curl, server-to-server) with no Origin header.
      if (!origin) return callback(null, true);
      if (allowed.includes("*") || allowed.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
}

module.exports = buildCors;
