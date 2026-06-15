"use strict";

const authenticate = require("../../../../shared/middleware/authenticate");

/**
 * Gateway-level JWT guard. Re-exports the shared authenticate middleware.
 * Applied to protected service routes before proxying so unauthenticated
 * requests are rejected with 401 at the edge.
 */
module.exports = authenticate;
