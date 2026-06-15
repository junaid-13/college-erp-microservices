"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.SUBJECT_SERVICE_URL || "http://localhost:4008";
const ROUTE = "/api/subjects";

/**
 * Dedicated reverse proxy for the Subject Service (Task 6.19).
 *
 * Forwards /api/subjects/* to the subject-service. A valid JWT is required at
 * the gateway; fine-grained role checks (HOD/ADMIN/FACULTY/STUDENT) are
 * enforced inside the subject-service routes.
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
