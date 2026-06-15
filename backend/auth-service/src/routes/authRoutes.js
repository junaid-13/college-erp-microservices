"use strict";

const express = require("express");

const authenticate = require("../../../../shared/middleware/authenticate");
const authController = require("../controllers/authController");
const validate = require("../middleware/validate");
const { loginSchema } = require("../validators/loginValidator");
const { changePasswordSchema } = require("../validators/passwordValidator");

const router = express.Router();

// Public
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

// Protected
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword,
);
router.get("/me", authenticate, authController.me);

module.exports = router;
