"use strict";

const express = require("express");

const authenticate = require("../../../../shared/middleware/authenticate");
const authorize = require("../../../../shared/middleware/authorize");
const controller = require("../controllers/studentController");
const validate = require("../middleware/validate");
const {
  createStudentSchema,
  updateStudentSchema,
  statusSchema,
} = require("../validators/studentValidator");


const router = express.Router();

// All student routes require authentication.
router.use(authenticate);

// Student self-profile (Task 4.18 / 4.25). Declared before "/:id"
// so "me" is not captured as an id.
router.get(
  "/me",
  authorize("STUDENT", "HOD", "ADMIN"),
  controller.getOwnProfile,
);

// HOD-managed CRUD (Task 4.18). ADMIN allowed as a superset.
const MANAGER = authorize("HOD", "ADMIN");

router.post(
  "/",
  MANAGER,
  validate(createStudentSchema),
  controller.createStudent,
);
router.get("/", MANAGER, controller.getStudents);
router.get("/:id", MANAGER, controller.getStudent);
router.put(
  "/:id",
  MANAGER,
  validate(updateStudentSchema),
  controller.updateStudent,
);
router.delete("/:id", MANAGER, controller.deleteStudent);
router.patch(
  "/:id/status",
  MANAGER,
  validate(statusSchema),
  controller.changeStatus,
);

module.exports = router;
