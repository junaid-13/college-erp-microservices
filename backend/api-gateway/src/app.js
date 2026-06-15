"use strict";

const express = require("express");

const logger = require("../../../shared/logger/logger");
const buildCors = require("../../../shared/middleware/cors");
const errorHandler = require("../../../shared/middleware/errorHandler");

const assessmentProxy = require("./routes/assessmentProxy");
const attendanceProxy = require("./routes/attendanceProxy");
const departmentProxy = require("./routes/departmentProxy");
const facultyProxy = require("./routes/facultyProxy");
const healthRoutes = require("./routes/health");
const proxyRoutes = require("./routes/index");
const leaveProxy = require("./routes/leaveProxy");
const libraryProxy = require("./routes/libraryProxy");
const marksProxy = require("./routes/marksProxy");
const notificationProxy = require("./routes/notificationProxy");
const payrollProxy = require("./routes/payrollProxy");
const studentProxy = require("./routes/studentProxy");
const subjectProxy = require("./routes/subjectProxy");
const timetableProxy = require("./routes/timetableProxy");

const app = express();

// Core middleware
app.use(buildCors());
app.use(logger.requestLogger);

// Health endpoints (gateway + aggregate dashboard).
app.use("/health", healthRoutes);

// Root.
app.get("/", (req, res) => {
  res.json({ service: "api-gateway", status: "ok" });
});

// Reverse-proxy routes to downstream services.
// IMPORTANT: proxying must happen BEFORE express.json(), otherwise the body
// stream is consumed here and forwarded POST/PUT requests hang downstream.
app.use(studentProxy); // dedicated Student Service proxy (Task 4.19)
app.use(departmentProxy); // dedicated Department Service proxy (Task 3.14)
app.use(facultyProxy); // dedicated Faculty Service proxy (Task 5.20)
app.use(subjectProxy); // dedicated Subject Service proxy (Task 6.19)
app.use(timetableProxy); // dedicated Timetable Service proxy (Task 7.21)
app.use(attendanceProxy); // dedicated Attendance Service proxy (Task 8.21)
app.use(marksProxy); // dedicated Marks Service proxy (Task 9.23)
app.use(leaveProxy); // dedicated Leave Service proxy (Task 10.20)
app.use(libraryProxy); // dedicated Library Service proxy (Task 12.24)
app.use(assessmentProxy); // dedicated Assessment Service proxy (Task 13.24)
app.use(payrollProxy); // dedicated Payroll Service proxy (Task 14.19)
app.use(notificationProxy); // dedicated Notification Service proxy (Task 15.21)
app.use(proxyRoutes);

// JSON body parsing for any routes the gateway itself handles (after proxy).
app.use(express.json());

// 404 + centralized error handling.
app.use(errorHandler.notFoundHandler);
app.use(errorHandler);

module.exports = app;
