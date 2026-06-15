"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.FACULTY_SERVICE_URL || "http://localhost:4003";
const ROUTE = "/api/faculties";

/**
 * Dedicated reverse proxy for the Faculty Service (Task 5.20).
 *
 * Forwards /api/faculties/* to the faculty-service. A valid JWT is required at
 * the gateway; fine-grained role checks (HOD/ADMIN/FACULTY) are enforced inside
 * the faculty-service routes.
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
