const express = require("express");
const { createApiKey, getMyApiKeys, deactivateApiKey, deleteApiKey } = require("./apiKey.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", createApiKey);
router.get("/", getMyApiKeys);
router.patch("/:id/deactivate", deactivateApiKey);
router.delete("/:id", deleteApiKey);

module.exports = router;
