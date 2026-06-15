"use strict";

const mongoose = require("mongoose");

// LIBRARIAN (M12) and PAYROLL_ADMIN (M14) added — reused by later
// inventory/store and HR/payroll modules.
const ROLES = [
  "ADMIN",
  "HOD",
  "FACULTY",
  "STUDENT",
  "LIBRARIAN",
  "PAYROLL_ADMIN",
];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      enum: ROLES,
      required: [true, "Role is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

// Never leak the password hash when serializing.
userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.ROLES = ROLES;
