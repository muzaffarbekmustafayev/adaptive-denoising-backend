const ApiKey = require("../modules/apiKey/apiKey.model");
const User = require("../modules/user/user.model");
const { hashApiKey } = require("../utils/apiKey.util");

const validateApiKey = async (req, res, next) => {
  const apiKeyString = req.headers["x-api-key"];

  if (!apiKeyString) {
    const error = new Error("API key is missing");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const hashedKey = hashApiKey(apiKeyString);
    const apiKey = await ApiKey.findOne({ keyHash: hashedKey }).populate("userId");

    if (!apiKey) {
      const error = new Error("Invalid API key");
      error.statusCode = 401;
      return next(error);
    }

    if (!apiKey.isActive) {
      const error = new Error("API key is inactive");
      error.statusCode = 403;
      return next(error);
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      const error = new Error("API key has expired");
      error.statusCode = 403;
      return next(error);
    }

    const user = apiKey.userId;
    if (!user || user.status === "BLOCKED") {
      const error = new Error("User associated with this API key is blocked or not found");
      error.statusCode = 403;
      return next(error);
    }

    // Check monthly limit
    if (apiKey.usageCount >= apiKey.monthlyLimit) {
      const error = new Error("API key monthly limit reached");
      error.statusCode = 429;
      return next(error);
    }

    req.apiKey = apiKey;
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validateApiKey };
