"use strict";

const Student = require("../models/Student");
const { validateYearSemester } = require("../utils/academicRules");
const { generateStudentCode } = require("../utils/studentCodeGenerator");

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

const MAX_CODE_RETRIES = 5;
const EMAIL_TAKEN = "A student with this email already exists";
const STUDENT_NOT_FOUND = "Student not found";

function isDuplicateKey(err, field) {
  return err.code === 11000 && err.keyPattern && err.keyPattern[field];
}

// Generate code with a small retry loop to survive races on the unique index.
async function createWithUniqueCode(data, prefix, year) {
  let lastErr;
  for (let i = 0; i < MAX_CODE_RETRIES; i += 1) {
    const studentCode = await generateStudentCode({ prefix, year });
    try {
      return await Student.create({ ...data, studentCode });
    } catch (err) {
      if (isDuplicateKey(err, "studentCode")) {
        lastErr = err; // collision — retry with the next sequence number
        continue;
      }
      if (isDuplicateKey(err, "email")) throw httpError(409, EMAIL_TAKEN);
      throw err;
    }
  }
  throw lastErr || httpError(500, "Failed to generate a unique student code");
}

/**
 * Create a student (Task 4.9). Generates a unique registration number,
 * validates academic year/semester, and enforces unique email.
 */
async function createStudent(payload) {
  const { program, departmentPrefix, ...data } = payload;

  // Academic rules (Task 4.17).
  const check = validateYearSemester(data.year, data.semester, program);
  if (!check.valid) throw httpError(400, check.message);

  // Reject duplicate email early for a clean message.
  const existing = await Student.findOne({ email: data.email.toLowerCase() });
  if (existing) throw httpError(409, EMAIL_TAKEN);

  const admissionYear = data.admissionDate
    ? new Date(data.admissionDate).getFullYear()
    : new Date().getFullYear();

  const prefix = departmentPrefix || program || "GEN";
  return createWithUniqueCode(data, prefix, admissionYear);
}

/**
 * List students with pagination, search and filters (Tasks 4.10–4.12).
 */
async function getStudents(query = {}) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};

  // By default hide soft-deleted students unless explicitly requested.
  // Coerce to String so a crafted query (e.g. ?status[$ne]=DELETED) cannot
  // inject Mongo operators via Express's qs parser (NoSQL operator injection).
  if (query.status) {
    filter.status = String(query.status);
  } else {
    filter.status = { $ne: "DELETED" };
  }

  // Academic filters (Task 4.12).
  if (query.departmentId) filter.departmentId = String(query.departmentId);
  if (query.year) filter.year = Number(query.year);
  if (query.semester) filter.semester = Number(query.semester);
  if (query.section) filter.section = String(query.section).toUpperCase();

  // Search across name / email / registration number (Task 4.11).
  if (query.search) {
    const rx = new RegExp(escapeRegExp(query.search), "i");
    filter.$or = [
      { firstName: rx },
      { lastName: rx },
      { email: rx },
      { studentCode: rx },
    ];
  }

  const [data, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Student.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

/**
 * Get one student by id (Task 4.13).
 */
async function getStudent(id) {
  const student = await Student.findById(id);
  if (!student || student.status === "DELETED") {
    throw httpError(404, STUDENT_NOT_FOUND);
  }
  return student;
}

/**
 * Update a student (Task 4.14).
 */
async function updateStudent(id, payload) {
  const student = await Student.findById(id);
  if (!student || student.status === "DELETED") {
    throw httpError(404, STUDENT_NOT_FOUND);
  }

  const { program, ...data } = payload;

  // Re-validate academic rules if year/semester changes.
  const year = data.year ?? student.year;
  const semester = data.semester ?? student.semester;
  if (data.year !== undefined || data.semester !== undefined) {
    const check = validateYearSemester(year, semester, program);
    if (!check.valid) throw httpError(400, check.message);
  }

  // Guard email uniqueness on change.
  if (data.email && data.email.toLowerCase() !== student.email) {
    const dup = await Student.findOne({ email: data.email.toLowerCase() });
    if (dup) throw httpError(409, EMAIL_TAKEN);
  }

  Object.assign(student, data);
  await student.save();
  return student;
}

/**
 * Soft-delete a student (Task 4.15). No physical deletion.
 */
async function deleteStudent(id) {
  const student = await Student.findById(id);
  if (!student || student.status === "DELETED") {
    throw httpError(404, STUDENT_NOT_FOUND);
  }
  student.status = "DELETED";
  await student.save();
  return { status: "DELETED" };
}

/**
 * Change student lifecycle status (Task 4.16).
 */
async function changeStatus(id, status) {
  const student = await Student.findById(id);
  if (!student) throw httpError(404, STUDENT_NOT_FOUND);
  student.status = status;
  await student.save();
  return student;
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  changeStatus,
};
