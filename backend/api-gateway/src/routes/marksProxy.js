"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.MARKS_SERVICE_URL || "http://localhost:4006";

/**
 * Dedicated reverse proxy for the Marks Service (Task 9.23).
 *
 * Two route families:
 *   /api/marks/*    -> stripped to /* (matches marksRoutes at root)
 *   /api/results/*  -> forwarded as-is (matches resultsRoutes mount)
 *
 * A valid JWT is required at the gateway; role checks are enforced inside the
 * marks-service routes.
 */
router.use(
  "/api/marks",
  authMiddleware,
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/marks", ""),
  }),
);

router.use(
  "/api/results",
  authMiddleware,
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    // Ensure the /api/results prefix is present so the service matches its
    // resultsRoutes mount, whether or not the path arrives already-stripped.
    pathRewrite: (path) =>
      path.startsWith("/api/results") ? path : `/api/results${path}`,
  }),
);

module.exports = router;
