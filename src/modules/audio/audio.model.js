const mongoose = require("mongoose");

const AudioJobSchema = new mongoose.Schema(
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
    originalFileName: String,
    inputPath: String,
    outputPath: String,
    mimeType: String,
    inputBytes: Number,
    outputBytes: {
      type: Number,
      default: 0
    },
    durationSeconds: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"],
      default: "QUEUED"
    },
    errorMessage: {
      type: String,
      default: null
    },
    startedAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("AudioJob", AudioJobSchema);
