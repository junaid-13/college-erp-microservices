"use strict";

/**
 * Registry of downstream microservices.
 * Each entry maps a public route prefix to a target base URL (from env).
 */
const services = [
  {
    name: "auth-service",
    route: "/api/auth",
    target: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
  },
  {
    name: "student-service",
    route: "/api/students",
    target: process.env.STUDENT_SERVICE_URL || "http://localhost:4002",
  },
  {
    name: "faculty-service",
    route: "/api/faculty",
    target: process.env.FACULTY_SERVICE_URL || "http://localhost:4003",
  },
  {
    name: "department-service",
    route: "/api/departments",
    target: process.env.DEPARTMENT_SERVICE_URL || "http://localhost:4004",
  },
  {
    name: "attendance-service",
    route: "/api/attendance",
    target: process.env.ATTENDANCE_SERVICE_URL || "http://localhost:4005",
  },
  {
    name: "marks-service",
    route: "/api/marks",
    target: process.env.MARKS_SERVICE_URL || "http://localhost:4006",
  },
  {
    name: "leave-service",
    route: "/api/leaves",
    target: process.env.LEAVE_SERVICE_URL || "http://localhost:4007",
  },
  {
    name: "subject-service",
    route: "/api/subjects",
    target: process.env.SUBJECT_SERVICE_URL || "http://localhost:4008",
  },
  {
    name: "timetable-service",
    route: "/api/timetable",
    target: process.env.TIMETABLE_SERVICE_URL || "http://localhost:4009",
  },
  {
    name: "assessment-service",
    route: "/api/assessments",
    target: process.env.ASSESSMENT_SERVICE_URL || "http://localhost:4010",
  },
  {
    name: "feedback-service",
    route: "/api/feedback",
    target: process.env.FEEDBACK_SERVICE_URL || "http://localhost:4011",
  },
  {
    name: "library-service",
    route: "/api/library",
    target: process.env.LIBRARY_SERVICE_URL || "http://localhost:4012",
  },
  {
    name: "payroll-service",
    route: "/api/payroll",
    target: process.env.PAYROLL_SERVICE_URL || "http://localhost:4013",
  },
  {
    name: "notification-service",
    route: "/api/notifications",
    target: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4014",
  },
];

module.exports = services;
