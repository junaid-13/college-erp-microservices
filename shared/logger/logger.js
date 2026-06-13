"use strict";

const winston = require("winston");

const { combine, timestamp, printf, colorize, errors } = winston.format;

const lineFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}] ${stack || message}`;
});

/**
 * Shared application logger.
 *
 * Provides:
 *  - logger.info(...)   info-level logs
 *  - logger.warn(...)
 *  - logger.error(...)  error-level logs (captures stack traces)
 *  - logger.requestLogger  Express middleware for request logging
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    lineFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        lineFormat,
      ),
    }),
  ],
});

/**
 * Express middleware that logs each incoming request and its response status.
 */
logger.requestLogger = function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
};

module.exports = logger;
