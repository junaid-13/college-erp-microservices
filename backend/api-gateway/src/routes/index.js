"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const services = require("../config/services");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Routes that must remain publicly accessible (login/refresh/logout).
const PUBLIC_ROUTES = ["/api/auth"];

// Routes handled by a dedicated proxy module (registered separately).
const DEDICATED_ROUTES = [
  "/api/students",
  "/api/departments",
  "/api/faculties",
  "/api/subjects",
  "/api/timetable", // matches the generic '/api/timetable' service entry
  "/api/attendance",
  "/api/marks",
  "/api/leaves",
  "/api/leave", // matches the generic '/api/leave' service entry
  "/api/library", // matches the generic '/api/library' service entry
  "/api/books",
  "/api/assessment", // matches the generic '/api/assessment' service entry
  "/api/assessments",
  "/api/payroll",
  "/api/notifications", // matches the generic '/api/notifications' service entry
];

/**
 * Register a reverse proxy for each downstream service.
 * Example: requests to /api/auth/* are proxied to the auth-service.
 *
 * Every route except the public auth endpoints requires a valid JWT,
 * enforced at the gateway before proxying.
 */
services.forEach((svc) => {
  if (DEDICATED_ROUTES.includes(svc.route)) return; // handled by studentProxy

  const proxy = createProxyMiddleware({
    target: svc.target,
    changeOrigin: true,
    pathRewrite: (path) => path.replace(svc.route, ""),
  });

  if (PUBLIC_ROUTES.includes(svc.route)) {
    router.use(svc.route, proxy);
  } else {
    router.use(svc.route, authMiddleware, proxy);
  }
});

module.exports = router;
