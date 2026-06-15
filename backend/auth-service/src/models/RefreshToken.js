"use strict";

const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// TTL index — MongoDB removes the document once expiresAt passes.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * True when the token is neither revoked nor expired.
 */
refreshTokenSchema.methods.isValid = function isValid() {
  return !this.isRevoked && this.expiresAt.getTime() > Date.now();
};

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
