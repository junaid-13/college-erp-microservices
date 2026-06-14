"use strict";

/* Seed sample students across departments, years and semesters (Task 4.26). */

const mongoose = require("mongoose");

const loadEnv = require("../../../../shared/config/env");
const connectMongo = require("../../../../shared/database/mongodb");
const logger = require("../../../../shared/logger/logger");
const Student = require("../models/Student");
const { semestersForYear } = require("../utils/academicRules");
const { generateStudentCode } = require("../utils/studentCodeGenerator");

loadEnv({ required: ["MONGODB_URI"] });

// Synthetic departments (real departments come from the department-service).
const departments = [
  {
    prefix: "BCA",
    program: "BCA",
    id: new mongoose.Types.ObjectId(),
    maxYears: 3,
  },
  {
    prefix: "BBA",
    program: "DEFAULT",
    id: new mongoose.Types.ObjectId(),
    maxYears: 3,
  },
  {
    prefix: "ENG",
    program: "ENGINEERING",
    id: new mongoose.Types.ObjectId(),
    maxYears: 4,
  },
];

const firstNames = [
  "John",
  "Jane",
  "Ravi",
  "Priya",
  "Alex",
  "Sara",
  "Amit",
  "Neha",
];
const lastNames = ["Sharma", "Patel", "Khan", "Singh", "Roy", "Das"];

function pick(arr, i) {
  return arr[i % arr.length];
}

/**
 * Seed a single student. `seq` is the running 1-based counter; the name/email
 * index is `seq - 1` and gender parity uses `seq`, matching the original order.
 * Returns true when a new student was created, false if the email already exists.
 */
async function seedStudent({ dept, year, semester, seq, admissionYear }) {
  const index = seq - 1;
  const first = pick(firstNames, index);
  const last = pick(lastNames, index);
  const email = `${first}.${last}.${index}@students.college.edu`.toLowerCase();

  if (await Student.findOne({ email })) return false;

  const studentCode = await generateStudentCode({
    prefix: dept.prefix,
    year: admissionYear,
  });

  await Student.create({
    studentCode,
    firstName: first,
    lastName: last,
    email,
    phone: "+910000000000",
    gender: seq % 2 ? "MALE" : "FEMALE",
    departmentId: dept.id,
    year,
    semester,
    section: "A",
    status: "ACTIVE",
    guardian: {
      name: `${first}'s Guardian`,
      phone: "+919999999999",
      relationship: "Parent",
    },
    address: { city: "Bengaluru", state: "KA", country: "India" },
  });
  return true;
}

// Yield every (dept, year, semester) seeding slot — 2 students per combo.
function* seedSlots() {
  for (const dept of departments) {
    for (let year = 1; year <= dept.maxYears; year += 1) {
      for (const semester of semestersForYear(year)) {
        for (let n = 0; n < 2; n += 1) yield { dept, year, semester };
      }
    }
  }
}

async function run() {
  await connectMongo({ serviceName: "student-service:seed" });

  const admissionYear = new Date().getFullYear();
  let created = 0;
  let counter = 0;

  for (const slot of seedSlots()) {
    counter += 1;
    if (await seedStudent({ ...slot, seq: counter, admissionYear })) {
      created += 1;
    }
  }

  logger.info(
    `[seed] Created ${created} students across ${departments.length} departments.`,
  );
  process.exit(0);
}

run().catch((err) => {
  logger.error(`[seed] Failed: ${err.message}`);
  process.exit(1);
});
