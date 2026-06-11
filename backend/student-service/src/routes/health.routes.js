"use strict";

const express = require("express");

const router = express.Router();

/**
 * GET /health
 * Liveness probe for student-service.
 */
router.get("/", (req, res) => {
  res.json({ status: "ok", service: "student-service" });
});

module.exports = router;
