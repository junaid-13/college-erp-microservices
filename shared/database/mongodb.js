"use strict";

const mongoose = require("mongoose");

const logger = require("../logger/logger");

/**
 * Reusable MongoDB (Atlas) connection utility.
 *
 * Features:
 *  - Single shared connection per process.
 *  - Connection + error + reconnect logging.
 *  - Mongoose auto-reconnect (built in to the driver) plus event visibility.
 *
 * @param {Object} [options]
 * @param {string} [options.uri]         Mongo connection string (defaults to process.env.MONGODB_URI).
 * @param {string} [options.serviceName] Name used in log lines.
 * @returns {Promise<typeof mongoose>}
 */
async function connectMongo(options = {}) {
  const uri = options.uri || process.env.MONGODB_URI;
  const serviceName =
    options.serviceName || process.env.SERVICE_NAME || "service";

  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Cannot connect to MongoDB.");
  }

  // Avoid creating multiple connections if already connected.
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  mongoose.set("strictQuery", true);

  const conn = mongoose.connection;

  conn.on("connected", () => {
    logger.info(
      `[${serviceName}] MongoDB connected: ${conn.host}/${conn.name}`,
    );
  });
  conn.on("error", (err) => {
    logger.error(`[${serviceName}] MongoDB connection error: ${err.message}`);
  });
  conn.on("disconnected", () => {
    logger.warn(
      `[${serviceName}] MongoDB disconnected. Driver will attempt to reconnect...`,
    );
  });
  conn.on("reconnected", () => {
    logger.info(`[${serviceName}] MongoDB reconnected.`);
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    // The MongoDB driver handles auto-reconnect natively; these tune the pool.
    maxPoolSize: 10,
    minPoolSize: 1,
  });

  return mongoose;
}

module.exports = connectMongo;
