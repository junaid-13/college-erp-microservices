"use strict";

const path = require("path");

const BACKEND = path.resolve(__dirname, "..", "..", "backend");
const FRONTEND = path.resolve(__dirname, "..", "..", "frontend");
const ROOT = path.resolve(__dirname, "..", "..");

/** Helper to build a standard PM2 app definition for a backend service. */
function service(name) {
  return {
    name,
    // Point straight at the service entry point so PM2 launches it with
    // node directly (more reliable than handing it a package.json).
    script: path.join(BACKEND, name, "src", "server.js"),
    cwd: path.join(BACKEND, name),
    interpreter: "node",
    // Fork mode: one plain node process per service. Cluster mode is heavier
    // and unnecessary for single-instance services (it caused heap OOM here).
    exec_mode: "fork",
    instances: 1,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    restart_delay: 2000,
    max_memory_restart: "300M",
    env: {
      NODE_ENV: "development",
    },
  };
}

function app(name) {
  return {
    name,
    cwd: path.join(FRONTEND, name),
    // Run the Vite dev server directly via its CLI entry. Each portal's
    // vite.config.js pins its own dev port, so no extra args are needed.
    script: path.join(ROOT, "node_modules", "vite", "bin", "vite.js"),
    interpreter: "node",
    // Fork mode: the Vite dev server must run as a single plain process —
    // it cannot be load-balanced in cluster mode.
    exec_mode: "fork",
    windowsHide: true,
    instances: 1,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    restart_delay: 2000,
    // Vite's esbuild needs far more than the 300M used for backend services;
    // a low cap causes a kill/restart loop and the portal never stays up.
    max_memory_restart: "300M",
    env: {
      NODE_ENV: "development",
      // Give the Vite/esbuild process enough V8 heap during dep optimization.
      NODE_OPTIONS: "--max-old-space-size=1024",
    },
  };
}

module.exports = {
  apps: [
    // Backend services
    service("api-gateway"),
    service("auth-service"),
    service("student-service"),
    service("faculty-service"),
    service("department-service"),
    service("attendance-service"),
    service("marks-service"),
    service("leave-service"),
    service("subject-service"),
    service("timetable-service"),
    service("assessment-service"),
    service("feedback-service"),
    service("library-service"),
    service("payroll-service"),
    service("notification-service"),

    // Frontend applications
    app("admin-portal"),
    app("student-portal"),
    app("faculty-portal"),
    app("hod-portal"),
    app("librarian-portal"),
    app("payroll-admin-portal"),
  ],
};
