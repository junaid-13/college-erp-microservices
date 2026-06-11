"use strict";

/**
 * Build an Express middleware that validates req.body against a Joi schema.
 * On failure responds 400 with a standardized error payload.
 */
module.exports = function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        })),
      });
    }
    req.body = value;
    next();
  };
};
