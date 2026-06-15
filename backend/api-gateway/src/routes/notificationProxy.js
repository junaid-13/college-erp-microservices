"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4014";
const ROUTE = "/api/notifications";

/**
 * Dedicated reverse proxy for the Notification Service (Task 15.21).
 *
 * Forwards /api/notifications/* to the notification-service. A valid JWT is
 * required at the gateway; the service always scopes results to req.user.
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
