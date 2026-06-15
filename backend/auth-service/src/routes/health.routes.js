"use strict";

const express = require("express");

const router = express.Router();

/**
 * GET /health
 * Liveness probe for auth-service.
 */
router.get("/", (req, res) => {
  res.json({ status: "ok", service: "auth-service" });
});

module.exports = router;
