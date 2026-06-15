"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.LEAVE_SERVICE_URL || "http://localhost:4007";
const ROUTE = "/api/leaves";

/**
 * Dedicated reverse proxy for the Leave Service (Task 10.20).
 *
 * Forwards /api/leaves/* to the leave-service. A valid JWT is required at the
 * gateway; fine-grained role checks (STUDENT/FACULTY/HOD) are enforced inside
 * the leave-service routes.
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
