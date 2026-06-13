"use strict";

/**
 * Barrel export for the shared library.
 */
module.exports = {
  connectMongo: require("./database/mongodb"),
  logger: require("./logger/logger"),
  cors: require("./middleware/cors"),
  errorHandler: require("./middleware/errorHandler"),
  authenticate: require("./middleware/authenticate"),
  authorize: require("./middleware/authorize"),
  s3: require("./aws/s3"),
};
