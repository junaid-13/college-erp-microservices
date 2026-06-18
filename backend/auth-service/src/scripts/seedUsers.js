"use strict";

/* Seed default system users (ADMIN, HOD, FACULTY, STUDENT). */

const loadEnv = require("../../../../shared/config/env");
const connectMongo = require("../../../../shared/database/mongodb");
const logger = require("../../../../shared/logger/logger");
const User = require("../models/User");
const { hashPassword } = require("../utils/password");

loadEnv({ required: ["MONGODB_URI"] });

const seeds = [
  {
    role: "ADMIN",
    email: process.env.SEED_ADMIN_EMAIL || "admin@college.edu",
    password: process.env.SEED_ADMIN_PASSWORD || "Admin@123",
  },
  {
    role: "HOD",
    email: process.env.SEED_HOD_EMAIL || "hod@college.edu",
    password: process.env.SEED_HOD_PASSWORD || "Hod@123",
  },
  {
    role: "FACULTY",
    email: process.env.SEED_FACULTY_EMAIL || "faculty@college.edu",
    password: process.env.SEED_FACULTY_PASSWORD || "Faculty@123",
  },
  {
    role: "STUDENT",
    email: process.env.SEED_STUDENT_EMAIL || "student@college.edu",
    password: process.env.SEED_STUDENT_PASSWORD || "Student@123",
  },
  {
    role: "LIBRARIAN",
    email: process.env.SEED_LIBRARIAN_EMAIL || "librarian@college.edu",
    password: process.env.SEED_LIBRARIAN_PASSWORD || "Librarian@123",
  },
  {
    role: "PAYROLL_ADMIN",
    email: process.env.SEED_PAYROLL_EMAIL || "payroll@college.edu",
    password: process.env.SEED_PAYROLL_PASSWORD || "Payroll@123",
  },
];

async function run() {
  await connectMongo({ serviceName: "auth-service:seed" });

  for (const s of seeds) {
    const email = s.email.toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
      logger.info(`[seed] ${s.role} already exists: ${email}`);
      continue;
    }
    const passwordHash = await hashPassword(s.password);
    await User.create({ email, passwordHash, role: s.role, isActive: true });
    logger.info(`[seed] Created ${s.role}: ${email}`);
  }

  logger.info("[seed] Done.");
  process.exit(0);
}

run().catch((err) => {
  logger.error(`[seed] Failed: ${err.message}`);
  process.exit(1);
});
