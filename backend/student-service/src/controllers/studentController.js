"use strict";

const studentService = require("../services/studentService");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

exports.createStudent = asyncHandler(async (req, res) => {
  const student = await studentService.createStudent(req.body);
  res.status(201).json({
    success: true,
    studentCode: student.studentCode,
    data: student,
  });
});

/**
 * GET /api/students  (Tasks 4.10–4.12)
 */
exports.getStudents = asyncHandler(async (req, res) => {
  const result = await studentService.getStudents(req.query);
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

/**
 * GET /api/students/:id  (Task 4.13)
 */
exports.getStudent = asyncHandler(async (req, res) => {
  const student = await studentService.getStudent(req.params.id);
  res.json({ success: true, data: student });
});

/**
 * PUT /api/students/:id  (Task 4.14)
 */
exports.updateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body);
  res.json({ success: true, data: student });
});

/**
 * DELETE /api/students/:id  (Task 4.15) — soft delete
 */
exports.deleteStudent = asyncHandler(async (req, res) => {
  const result = await studentService.deleteStudent(req.params.id);
  res.json({ success: true, ...result });
});

/**
 * PATCH /api/students/:id/status  (Task 4.16)
 */
exports.changeStatus = asyncHandler(async (req, res) => {
  const student = await studentService.changeStatus(
    req.params.id,
    req.body.status,
  );
  res.json({ success: true, data: student });
});

/**
 * GET /api/students/me  — student views own profile (Task 4.18 / 4.25)
 * Matches the authenticated user's email to a student record.
 */
exports.getOwnProfile = asyncHandler(async (req, res) => {
  const Student = require("../models/Student");
  const student = await Student.findOne({
    email: (req.user.email || "").toLowerCase(),
    status: { $ne: "DELETED" },
  });
  if (!student) {
    return res
      .status(404)
      .json({ success: false, message: "Profile not found" });
  }
  res.json({ success: true, data: student });
});
