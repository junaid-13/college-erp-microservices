"use strict";

const crypto = require("crypto");

const REFRESH_EXPIRES_DAYS = parseInt(
  process.env.JWT_REFRESH_EXPIRES_DAYS || "7",
  10,
);

/**
 * Generate a cryptographically secure random refresh token plus its expiry.
 * Suitable for long-term sessions; stored hashed-by-uniqueness in DB.
 *
 * @returns {{ token: string, expiresAt: Date }}
 */
function generateRefreshToken() {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(
    Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  );
  return { token, expiresAt };
}

module.exports = { generateRefreshToken };
