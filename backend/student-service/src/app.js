"use strict";

const express = require("express");

const {
  buildHealthRouter,
  mongoDependency,
} = require("../../../shared/health/health");
const logger = require("../../../shared/logger/logger");
const metrics = require("../../../shared/metrics/metrics");
const correlationId = require("../../../shared/middleware/correlationId");
const buildCors = require("../../../shared/middleware/cors");
const errorHandler = require("../../../shared/middleware/errorHandler");

const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(buildCors());
app.use(correlationId);
app.use(express.json());
app.use(logger.requestLogger);
app.use(metrics.httpMetrics("student-service"));

app.use(
  "/health",
  buildHealthRouter({
    serviceName: "student-service",
    dependencies: { mongo: mongoDependency() },
  }),
);
app.get("/metrics", metrics.metricsHandler);

app.use("/", studentRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.json({ service: "student-service", status: "ok" });
});

app.use(errorHandler.notFoundHandler);
app.use(errorHandler);

module.exports = app;
