"use strict";

/*
 * Issue tokens for an existing user, identified by email.
 *
 * Usage:
 *   node src/scripts/generateToken.js <email>
 *   npm run token -- student@college.edu
 *
 * Prints a freshly signed access token and a persisted refresh token. Useful
 * for manual API testing without going through the /login endpoint.
 */

const loadEnv = require("../../../../shared/config/env");
const connectMongo = require("../../../../shared/database/mongodb");
const logger = require("../../../../shared/logger/logger");
loadEnv({ required: ["MONGODB_URI"] });
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const { generateAccessToken, verifyAccessToken } = require("../utils/jwt");
const { generateRefreshToken } = require("../utils/refreshToken");

async function run() {
  // Email comes from the first CLI argument (or the SEED_TOKEN_EMAIL env var).
  const email = (process.argv[2] || process.env.SEED_TOKEN_EMAIL || "")
    .trim()
    .toLowerCase();

  if (!email) {
    logger.error(
      "[token] No email provided. Usage: node src/scripts/generateToken.js <email>",
    );
    process.exit(1);
  }

  await connectMongo({ serviceName: "auth-service:token" });

  const user = await User.findOne({ email });
  if (!user) {
    logger.error(`[token] No user found for email: ${email}`);
    process.exit(1);
  }
  if (!user.isActive) {
    logger.error(`[token] User is inactive: ${email}`);
    process.exit(1);
  }

  // Create the access token and verify it before printing.
  let accessToken;
  try {
    accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });
    verifyAccessToken(accessToken);
  } catch (err) {
    logger.error(`[token] Token generation/validation failed: ${err.message}`);
    process.exit(1);
  }

  // Create and persist the refresh token (a real session record).
  const { token: refreshToken, expiresAt } = generateRefreshToken();
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt,
  });

  logger.info(`[token] Tokens issued for ${user.role}: ${email}`);
  // Print the tokens to stdout so they can be copied / piped.
  console.log(
    JSON.stringify(
      {
        user: { id: user._id.toString(), email: user.email, role: user.role },
        accessToken,
        refreshToken,
        refreshExpiresAt: expiresAt.toISOString(),
      },
      null,
      2,
    ),
  );

  process.exit(0);
}

run().catch((err) => {
  logger.error(`[token] Failed: ${err.message}`);
  process.exit(1);
});
