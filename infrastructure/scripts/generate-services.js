"use strict";

/* One-off scaffolder: generates the standard skeleton for each microservice. */

const fs = require("fs");
const path = require("path");

const BACKEND = path.resolve(__dirname, "..", "..", "backend");

const services = [
  { name: "auth-service", port: 4001 },
  { name: "student-service", port: 4002 },
  { name: "faculty-service", port: 4003 },
  { name: "department-service", port: 4004 },
  { name: "attendance-service", port: 4005 },
  { name: "marks-service", port: 4006 },
  { name: "leave-service", port: 4007 },
  { name: "subject-service", port: 4008 },
  { name: "timetable-service", port: 4009 },
  { name: "assessment-service", port: 4010 },
  { name: "feedback-service", port: 4011 },
  { name: "library-service", port: 4012 },
  { name: "payroll-service", port: 4013 },
  { name: "notification-service", port: 4014 },
];

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function pkg(name) {
  return `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "College ERP ${name}",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mongoose": "^8.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  },
  "license": "MIT"
}
`;
}

function env(name, port) {
  return `NODE_ENV=development
SERVICE_NAME=${name}
PORT=${port}
// MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/college_erp?retryWrites=true&w=majority
MONGODB_URI=mongodb://localhost:27017/college_erp_${name}
CORS_ORIGINS=http://localhost:5173
`;
}

function databaseConfig(name) {
  return `'use strict';

const connectMongo = require('../../../../shared/database/mongodb');

/**
 * Connect this service to MongoDB Atlas using the shared utility.
 */
module.exports = function connectDB() {
  return connectMongo({ serviceName: '${name}' });
};
`;
}

function appJs(name) {
  return `'use strict';

const express = require('express');

const buildCors = require('../../../shared/middleware/cors');
const errorHandler = require('../../../shared/middleware/errorHandler');
const logger = require('../../../shared/logger/logger');

const healthRoutes = require('./routes/health.routes');

const app = express();

app.use(buildCors());
app.use(express.json());
app.use(logger.requestLogger);

app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.json({ service: '${name}', status: 'ok' });
});

app.use(errorHandler.notFoundHandler);
app.use(errorHandler);

module.exports = app;
`;
}

function serverJs(name) {
  return `'use strict';

const loadEnv = require('../../../shared/config/env');
const logger = require('../../../shared/logger/logger');

loadEnv({ required: ['PORT', 'MONGODB_URI'] });

const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT;

(async () => {
  try {
    await connectDB();
  } catch (err) {
    logger.error('[${name}] Failed to connect to MongoDB: ' + err.message);
    // Service still starts so its /health endpoint stays reachable.
  }

  app.listen(PORT, () => {
    logger.info('[${name}] listening on port ' + PORT);
  });
})();
`;
}

function healthRoutes(name) {
  return `'use strict';

const express = require('express');
const router = express.Router();

/**
 * GET /health
 * Liveness probe for ${name}.
 */
router.get('/', (req, res) => {
  res.json({ status: 'ok', service: '${name}' });
});

module.exports = router;
`;
}

function healthController(name) {
  return `'use strict';

/**
 * Placeholder controller for ${name}.
 * Business logic controllers will be added in later milestones.
 */
exports.health = (req, res) => {
  res.json({ status: 'ok', service: '${name}' });
};
`;
}

function gitkeep() {
  return "";
}

for (const { name, port } of services) {
  const root = path.join(BACKEND, name);

  write(path.join(root, "package.json"), pkg(name));
  write(path.join(root, ".env"), env(name, port));
  write(path.join(root, ".env.example"), env(name, port));

  write(path.join(root, "src", "app.js"), appJs(name));
  write(path.join(root, "src", "server.js"), serverJs(name));
  write(path.join(root, "src", "config", "database.js"), databaseConfig(name));
  write(
    path.join(root, "src", "routes", "health.routes.js"),
    healthRoutes(name),
  );
  write(
    path.join(root, "src", "controllers", "health.controller.js"),
    healthController(name),
  );

  // Keep empty structural folders in version control.
  write(path.join(root, "src", "services", ".gitkeep"), gitkeep());
  write(path.join(root, "src", "models", ".gitkeep"), gitkeep());

  console.log("Generated " + name + " (port " + port + ")");
}

console.log("Done. Generated " + services.length + " services.");
