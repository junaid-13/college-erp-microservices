"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.STUDENT_SERVICE_URL || "http://localhost:4002";
const ROUTE = "/api/students";

/**
 * Dedicated reverse proxy for the Student Service (Task 4.19).
 *
 * Forwards /api/students/* to the student-service. A valid JWT is required
 * at the gateway; fine-grained role checks (HOD/ADMIN/STUDENT) are enforced
 * inside the student-service routes.
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
