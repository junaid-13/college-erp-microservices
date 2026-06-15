"use strict";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const TARGET = process.env.LIBRARY_SERVICE_URL || "http://localhost:4012";

/**
 * Dedicated reverse proxy for the Library Service (Task 12.24).
 *
 * Two route families:
 *   /api/books/*    -> stripped to /* (matches booksRoutes at root)
 *   /api/library/*  -> forwarded with prefix preserved (matches libraryRoutes)
 *
 * A valid JWT is required at the gateway; role checks are enforced inside the
 * library-service routes.
 */
router.use(
  "/api/books",
  authMiddleware,
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api/books", ""),
  }),
);

router.use(
  "/api/library",
  authMiddleware,
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    // Ensure the /api/library prefix is present whether or not the path arrives
    // already-stripped by the mount.
    pathRewrite: (path) =>
      path.startsWith("/api/library") ? path : `/api/library${path}`,
  }),
);

module.exports = router;
