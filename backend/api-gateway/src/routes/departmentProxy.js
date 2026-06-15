"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.DEPARTMENT_SERVICE_URL || "http://localhost:4004";
const ROUTE = "/api/departments";

/**
 * Dedicated reverse proxy for the Department Service (Task 3.14).
 *
 * Forwards /api/departments/* to the department-service. A valid JWT is
 * required at the gateway; fine-grained role checks (ADMIN/HOD) are enforced
 * inside the department-service routes.
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
