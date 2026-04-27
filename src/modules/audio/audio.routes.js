const express = require("express");
const { denoise, getJobStatus, downloadOutput } = require("./audio.controller");
const { validateApiKey } = require("../../middleware/apiKey.middleware");
const { protect } = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

const router = express.Router();

// Publicly accessible via API key
router.post("/denoise", validateApiKey, upload.single("audio"), denoise);

// Accessible via API key OR JWT
const authOrApiKey = (req, res, next) => {
  if (req.headers["x-api-key"]) {
    return validateApiKey(req, res, next);
  }
  return protect(req, res, next);
};

router.get("/jobs/:id", authOrApiKey, getJobStatus);
router.get("/jobs/:id/download", authOrApiKey, downloadOutput);

module.exports = router;
