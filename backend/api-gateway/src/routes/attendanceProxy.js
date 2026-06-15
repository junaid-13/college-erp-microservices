"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.ATTENDANCE_SERVICE_URL || "http://localhost:4005";
const ROUTE = "/api/attendance";

/**
 * Dedicated reverse proxy for the Attendance Service (Task 8.21).
 *
 * Forwards /api/attendance/* to the attendance-service. A valid JWT is required
 * at the gateway; fine-grained role checks (FACULTY/HOD/STUDENT) are enforced
 * inside the attendance-service routes.
 */
router.use(
  ROUTE,
  authMiddleware,
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: (path) => path.replace(ROUTE, ""),
  }),
);

module.exports = router;
module.exports.ROUTE = ROUTE;
