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

/**
 * JWT authentication middleware.
 *
 * Reads a Bearer token from the Authorization header, verifies it,
 * and attaches the decoded payload to req.user ({ userId, role }).
 *
 *  - Missing token -> 401
 *  - Invalid/expired token -> 401
 *  - Valid token -> next()
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    req.user = jwt.verify(token, ACCESS_SECRET, {
      algorithms: [JWT_ALGORITHM],
    });
    return next();
  } catch (_) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

module.exports = authenticate;
