"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.PAYROLL_SERVICE_URL || "http://localhost:4013";
const ROUTE = "/api/payroll";

/**
 * Dedicated reverse proxy for the Payroll Service (Task 14.19).
 *
 * Forwards /api/payroll/* to the payroll-service. A valid JWT is required at
 * the gateway; fine-grained role checks (PAYROLL_ADMIN/FACULTY/HOD) and
 * ownership are enforced inside the payroll-service.
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
