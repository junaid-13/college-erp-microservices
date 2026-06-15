"use strict";

const connectMongo = require("../../../../shared/database/mongodb");

/**
 * Connect this service to MongoDB Atlas using the shared utility.
 */
module.exports = function connectDB() {
  return connectMongo({ serviceName: "auth-service" });
};
