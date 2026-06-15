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

async function getStudents(query = {}) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.status) {
    filter.status = String(query.status);
  } else {
    filter.status = { $ne: "DELETED" };
  }

  if (query.departmentId) filter.departmentId = String(query.departmentId);
  if (query.year) filter.year = Number(query.year);
  if (query.semester) filter.semester = Number(query.semester);
  if (query.section) filter.section = String(query.section).toUpperCase();

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

async function getStudent(id) {
  const student = await Student.findById(id);
  if (!student || student.status === "DELETED") {
    throw httpError(404, STUDENT_NOT_FOUND);
  }
  return student;
}

async function updateStudent(id, payload) {
  const student = await Student.findById(id);
  if (!student || student.status === "DELETED") {
    throw httpError(404, STUDENT_NOT_FOUND);
  }

  const { program, ...data } = payload;

  const year = data.year ?? student.year;
  const semester = data.semester ?? student.semester;
  if (data.year !== undefined || data.semester !== undefined) {
    const check = validateYearSemester(year, semester, program);
    if (!check.valid) throw httpError(400, check.message);
  }

  if (data.email && data.email.toLowerCase() !== student.email) {
    const dup = await Student.findOne({ email: data.email.toLowerCase() });
    if (dup) throw httpError(409, EMAIL_TAKEN);
  }

  Object.assign(student, data);
  await student.save();
  return student;
}

async function deleteStudent(id) {
  const student = await Student.findById(id);
  if (!student || student.status === "DELETED") {
    throw httpError(404, STUDENT_NOT_FOUND);
  }
  student.status = "DELETED";
  await student.save();
  return { status: "DELETED" };
}

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
