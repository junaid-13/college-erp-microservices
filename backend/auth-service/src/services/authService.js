"use strict";

const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const { generateAccessToken, verifyAccessToken } = require("../utils/jwt");
const { comparePassword, hashPassword } = require("../utils/password");
const { generateRefreshToken } = require("../utils/refreshToken");

/**
 * Small helper to throw HTTP-flavored errors that the error handler maps.
 */
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/**
 * Authenticate a user and issue access + refresh tokens.
 */
async function login(email, password) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    throw httpError(401, "Invalid credentials");
  }

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    throw httpError(401, "Invalid credentials");
  }

  // Generate the access token, then verify it before handing it back so a
  // misconfigured signer/secret fails here rather than on the next request.
  let accessToken;
  try {
    accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });
    verifyAccessToken(accessToken);
  } catch (_) {
    throw httpError(500, "Token generation/validation failed");
  }

  const { token, expiresAt } = generateRefreshToken();
  await RefreshToken.create({ userId: user._id, token, expiresAt });

  user.lastLogin = new Date();
  await user.save();

  return {
    accessToken,
    refreshToken: token,
    user: user.toJSON(),
  };
}

/**
 * Revoke a refresh token (logout).
 */
async function logout(refreshToken) {
  if (!refreshToken) {
    throw httpError(400, "Refresh token is required");
  }
  await RefreshToken.findOneAndUpdate(
    { token: refreshToken },
    { isRevoked: true },
  );
  return { success: true };
}

/**
 * Exchange a valid refresh token for a new access token (and rotate refresh).
 */
async function refreshToken(token) {
  if (!token) {
    throw httpError(400, "Refresh token is required");
  }

  const stored = await RefreshToken.findOne({ token });
  if (!stored || !stored.isValid()) {
    throw httpError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(stored.userId);
  if (!user || !user.isActive) {
    throw httpError(401, "User no longer active");
  }

  // Rotate: revoke old token, issue a new one.
  stored.isRevoked = true;
  await stored.save();

  const newAccess = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });
  const { token: newRefresh, expiresAt } = generateRefreshToken();
  await RefreshToken.create({
    userId: user._id,
    token: newRefresh,
    expiresAt,
  });

  return { accessToken: newAccess, refreshToken: newRefresh };
}

/**
 * Change a user's password and invalidate all their existing sessions.
 */
async function changePassword(userId, oldPassword, newPassword) {
  const user = await User.findById(userId);
  if (!user) {
    throw httpError(404, "User not found");
  }

  const ok = await comparePassword(oldPassword, user.passwordHash);
  if (!ok) {
    throw httpError(400, "Old password is incorrect");
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  // Invalidate every existing session for this user.
  await RefreshToken.updateMany(
    { userId: user._id, isRevoked: false },
    { isRevoked: true },
  );

  return { success: true };
}

/**
 * Fetch the current user's public profile.
 */
async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw httpError(404, "User not found");
  }
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
}

module.exports = {
  login,
  logout,
  refreshToken,
  changePassword,
  getCurrentUser,
};
