"use strict";

const loadEnv = require("../../../shared/config/env");
const logger = require("../../../shared/logger/logger");

loadEnv({ required: ["PORT", "MONGODB_URI"] });

const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT;

(async () => {
  try {
    await connectDB();
  } catch (err) {
    logger.error(
      "[student-service] Failed to connect to MongoDB: " + err.message,
    );
    // Service still starts so its /health endpoint stays reachable.
  }

  app.listen(PORT, () => {
    logger.info("[student-service] listening on port " + PORT);
  });
})();
