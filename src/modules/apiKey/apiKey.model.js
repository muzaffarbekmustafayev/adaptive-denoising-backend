const mongoose = require("mongoose");

const ApiKeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    keyPrefix: {
      type: String,
      required: true
    },
    keyHash: {
      type: String,
      required: true,
      unique: true
    },
    usageCount: {
      type: Number,
      default: 0
    },
    monthlyLimit: {
      type: Number,
      default: 1000
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastUsedAt: {
      type: Date,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ApiKey", ApiKeySchema);
