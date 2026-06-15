"use strict";

const authService = require("../services/authService");

/**
 * Wrap async handlers so thrown errors reach the centralized error handler.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * POST /api/auth/login
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(result);
});

/**
 * POST /api/auth/refresh-token
 */
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  res.json(result);
});

/**
 * POST /api/auth/logout
 */
exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  res.json({ success: true, message: "Logged out successfully" });
});

/**
 * POST /api/auth/change-password  (protected)
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(req.user.userId, oldPassword, newPassword);
  res.json({
    success: true,
    message: "Password changed. Please log in again.",
  });
});

/**
 * GET /api/auth/me  (protected)
 */
exports.me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);
  res.json(user);
});
