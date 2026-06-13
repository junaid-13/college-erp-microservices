"use strict";

const express = require("express");

const logger = require("../../../shared/logger/logger");
const buildCors = require("../../../shared/middleware/cors");
const errorHandler = require("../../../shared/middleware/errorHandler");

const healthRoutes = require("./routes/health.routes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(buildCors());
app.use(express.json());
app.use(logger.requestLogger);

app.use("/health", healthRoutes);

// Student API. Mounted at root (the gateway strips the /api/students prefix)
// and at /api/students (for direct service access during testing).
app.use("/", studentRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.json({ service: "student-service", status: "ok" });
});

app.use(errorHandler.notFoundHandler);
app.use(errorHandler);

module.exports = app;
