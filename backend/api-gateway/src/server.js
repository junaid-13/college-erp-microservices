"use strict";

const loadEnv = require("../../../shared/config/env");
const logger = require("../../../shared/logger/logger");

// Load + validate environment before anything else.
loadEnv({ required: ["PORT"] });

const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`[api-gateway] Gateway listening on port ${PORT}`);
});
