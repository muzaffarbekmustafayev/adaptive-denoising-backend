const mongoose = require("mongoose");

const UsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    apiKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKey",
      required: true,
      index: true
    },
    audioJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AudioJob",
      default: null
    },
    requests: {
      type: Number,
      default: 1
    },
    durationSeconds: {
      type: Number,
      default: 0
    },
    inputBytes: {
      type: Number,
      default: 0
    },
    outputBytes: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS"
    },
    errorMessage: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usage", UsageSchema);
