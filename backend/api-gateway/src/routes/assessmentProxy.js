"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.ASSESSMENT_SERVICE_URL || "http://localhost:4010";

/**
 * Dedicated reverse proxy for the Assessment Service (Task 13.24).
 *
 * Two route families:
 *   /api/assessments/*  -> stripped to /* (matches assessmentRoutes at root)
 *   /api/submissions/*  -> forwarded with prefix preserved (matches submissionsRoutes)
 *
 * A valid JWT is required at the gateway; role checks are enforced inside the
 * assessment-service routes.
 */
router.use(
  "/api/assessments",
  authMiddleware,
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/assessments", ""),
  }),
);

router.use(
  "/api/submissions",
  authMiddleware,
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    // Ensure the /api/submissions prefix is present whether or not the path
    // arrives already-stripped by the mount.
    pathRewrite: (path) =>
      path.startsWith("/api/submissions") ? path : `/api/submissions${path}`,
  }),
);

module.exports = router;
