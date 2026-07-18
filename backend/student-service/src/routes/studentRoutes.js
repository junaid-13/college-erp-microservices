"use strict";

const express = require("express");

const { audit } = require("../../../../shared/audit/audit");
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

router.use(authenticate);


router.get(
  "/me",
  authorize("STUDENT", "HOD", "ADMIN"),
  controller.getOwnProfile,
);

const MANAGER = authorize("HOD", "ADMIN");

router.post(
  "/",
  MANAGER,
  audit("student.create", "student", { service: "student-service" }),
  validate(createStudentSchema),
  controller.createStudent,
);
router.get("/", MANAGER, controller.getStudents);
router.get("/:id", MANAGER, controller.getStudent);
router.put(
  "/:id",
  MANAGER,
  audit("student.update", "student", { service: "student-service" }),
  validate(updateStudentSchema),
  controller.updateStudent,
);
router.delete(
  "/:id",
  MANAGER,
  audit("student.delete", "student", { service: "student-service" }),
  controller.deleteStudent,
);
router.patch(
  "/:id/status",
  MANAGER,
  audit("student.status", "student", { service: "student-service" }),
  validate(statusSchema),
  controller.changeStatus,
);

module.exports = router;
