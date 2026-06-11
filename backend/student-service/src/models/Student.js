"use strict";

const mongoose = require("mongoose");

const STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED", "GRADUATED", "DELETED"];
const GENDERS = ["MALE", "FEMALE", "OTHER"];

// --- Address subdocument (Task 4.2) ---
const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

// --- Guardian subdocument (Task 4.3) ---
const guardianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Guardian name is required"],
    },
    relationship: { type: String, trim: true, default: "" },
    phone: {
      type: String,
      trim: true,
      required: [true, "Guardian phone is required"],
    },
    email: { type: String, trim: true, lowercase: true, default: "" },
  },
  { _id: false },
);

// --- Student schema (Task 4.1) ---
const studentSchema = new mongoose.Schema(
  {
    studentCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: { type: String, trim: true, default: "" },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true, default: "" },
    gender: { type: String, enum: GENDERS, default: "MALE" },
    dateOfBirth: { type: Date, default: null },

    // Academic mapping
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
      index: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 1,
      max: 6,
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 12,
    },
    section: { type: String, trim: true, uppercase: true, default: "A" },

    admissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: STATUSES, default: "ACTIVE", index: true },

    address: { type: addressSchema, default: () => ({}) },
    guardian: { type: guardianSchema, required: true },
  },
  { timestamps: true },
);

studentSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
module.exports.STATUSES = STATUSES;
module.exports.GENDERS = GENDERS;
