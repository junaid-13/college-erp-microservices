"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.TIMETABLE_SERVICE_URL || "http://localhost:4009";

/**
 * Dedicated reverse proxy for the Timetable Service (Task 7.21).
 *
 * Two route families are forwarded:
 *   /api/timetables/*       -> stripped to /* (matches timetableRoutes at root)
 *   /api/timetable-slots/*  -> forwarded as-is (matches timetableSlotRoutes)
 *
 * A valid JWT is required at the gateway; role checks are enforced inside the
 * timetable-service routes.
 */
router.use(
  "/api/timetables",
  authMiddleware,
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/timetables", ""),
  }),
);

router.use(
  "/api/timetable-slots",
  authMiddleware,
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    // Keep the prefix as-is so the service matches /api/timetable-slots/:id.
    pathRewrite: (path) => path,
  }),
);

module.exports = router;
