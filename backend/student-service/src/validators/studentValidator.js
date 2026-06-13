"use strict";

const Joi = require("joi");

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "A valid departmentId is required",
  });

const phone = Joi.string()
  .pattern(/^[+]?[\d\s\-()]{7,15}$/)
  .messages({ "string.pattern.base": "Invalid phone number format" });

const addressSchema = Joi.object({
  street: Joi.string().allow("").optional(),
  city: Joi.string().allow("").optional(),
  state: Joi.string().allow("").optional(),
  country: Joi.string().allow("").optional(),
  postalCode: Joi.string().allow("").optional(),
});

const guardianSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Guardian name is required" }),
  relationship: Joi.string().allow("").optional(),
  phone: phone
    .required()
    .messages({ "any.required": "Guardian phone is required" }),
  email: Joi.string().email().allow("").optional(),
});

// Create (Task 4.4) — required: firstName, email, departmentId, year, semester
const createStudentSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .messages({ "any.required": "First name is required" }),
  lastName: Joi.string().allow("").optional(),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "A valid email is required",
  }),
  phone: phone.allow("").optional(),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").optional(),
  dateOfBirth: Joi.date().optional(),

  departmentId: objectId
    .required()
    .messages({ "any.required": "Department is required" }),
  departmentPrefix: Joi.string().optional(), // used to build studentCode
  program: Joi.string().optional(),
  year: Joi.number().integer().min(1).max(6).required().messages({
    "any.required": "Year is required",
    "number.min": "Year must be at least 1",
    "number.max": "Year must be at most 6",
  }),
  semester: Joi.number().integer().min(1).max(12).required().messages({
    "any.required": "Semester is required",
    "number.min": "Semester must be at least 1",
    "number.max": "Semester must be at most 12",
  }),
  section: Joi.string().optional(),
  admissionDate: Joi.date().optional(),

  address: addressSchema.optional(),
  guardian: guardianSchema.required(),
});

// Update — all fields optional, but same constraints when present.
const updateStudentSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string().allow(""),
  email: Joi.string().email(),
  phone: phone.allow(""),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER"),
  dateOfBirth: Joi.date(),
  departmentId: objectId,
  program: Joi.string(),
  year: Joi.number().integer().min(1).max(6),
  semester: Joi.number().integer().min(1).max(12),
  section: Joi.string(),
  address: addressSchema,
  guardian: guardianSchema,
}).min(1);

const statusSchema = Joi.object({
  status: Joi.string()
    .valid("ACTIVE", "INACTIVE", "SUSPENDED", "GRADUATED", "DELETED")
    .required()
    .messages({ "any.required": "Status is required" }),
});

module.exports = { createStudentSchema, updateStudentSchema, statusSchema };
