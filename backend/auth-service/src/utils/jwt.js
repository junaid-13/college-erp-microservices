"use strict";

const jwt = require("jsonwebtoken");

// Token signing algorithm — pinned to prevent algorithm-confusion attacks.
const JWT_ALGORITHM = "HS256";

/**
 * Resolve the access-token secret.
 * Fails fast in production if unset (never fall back to a known default secret);
 * in non-production a clearly-marked dev secret is used so local work continues.
 */
function resolveAccessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_ACCESS_SECRET is not set. Refusing to start with an insecure default secret.",
    );
  }
  console.warn(
    "[auth] JWT_ACCESS_SECRET not set — using an insecure DEV-ONLY secret. Do not use in production.",
  );
  return "dev_access_secret_change_me";
}

const ACCESS_SECRET = resolveAccessSecret();
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

/**
 * Generate a signed JWT access token.
 * @param {Object} payload  Must include userId and role.
 * @param {string} payload.email  Optional, for self-profile lookups.
 * @param {string} payload.userId
 * @param {string} payload.role
 * @returns {string}
 */
function generateAccessToken({ userId, role, email }) {
  const payload = { userId, role };
  if (email) payload.email = email; // optional, enables self-profile lookups
  return jwt.sign(payload, ACCESS_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT access token.
 * @param {string} token
 * @returns {Object} decoded payload ({ userId, role, iat, exp })
 * @throws if invalid or expired
 */
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET, { algorithms: [JWT_ALGORITHM] });
}

module.exports = { generateAccessToken, verifyAccessToken };
