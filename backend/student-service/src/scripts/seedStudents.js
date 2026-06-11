"use strict";

/* Seed sample students across departments, years and semesters (Task 4.26). */

const mongoose = require("mongoose");

const loadEnv = require("../../../../shared/config/env");
const connectMongo = require("../../../../shared/database/mongodb");
const logger = require("../../../../shared/logger/logger");

loadEnv({ required: ["MONGODB_URI"] });

const Student = require("../models/Student");
const { semestersForYear } = require("../utils/academicRules");
const { generateStudentCode } = require("../utils/studentCodeGenerator");

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

async function run() {
  await connectMongo({ serviceName: "student-service:seed" });

  let created = 0;
  let counter = 0;

  for (const dept of departments) {
    const admissionYear = new Date().getFullYear();
    for (let year = 1; year <= dept.maxYears; year += 1) {
      for (const semester of semestersForYear(year)) {
        // 2 students per (dept, year, semester)
        for (let n = 0; n < 2; n += 1) {
          const first = pick(firstNames, counter);
          const last = pick(lastNames, counter);
          const email =
            `${first}.${last}.${counter}@students.college.edu`.toLowerCase();
          counter += 1;

          if (await Student.findOne({ email })) continue;

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
            gender: counter % 2 ? "MALE" : "FEMALE",
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
          created += 1;
        }
      }
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
