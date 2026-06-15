"use strict";

const axios = require("axios");
const express = require("express");

const services = require("../config/services");

const router = express.Router();

/**
 * GET /health
 * Liveness check for the gateway itself.
 */
router.get("/", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * GET /health/services
 * Aggregate health dashboard — pings every downstream service's /health
 * endpoint and reports UP / DOWN.
 *
 * Example response:
 * {
 *   "auth-service": "UP",
 *   "student-service": "UP",
 *   ...
 * }
 */
router.get("/services", async (req, res) => {
  const checks = await Promise.all(
    services.map(async (svc) => {
      try {
        const { status } = await axios.get(`${svc.target}/health`, {
          timeout: 3000,
        });
        return [svc.name, status === 200 ? "UP" : "DOWN"];
      } catch (_) {
        return [svc.name, "DOWN"];
      }
    }),
  );

  res.json(Object.fromEntries(checks));
});

module.exports = router;
