const ApiKey = require("./apiKey.model");
const { generateApiKey } = require("../../utils/apiKey.util");

const createApiKey = async (userId, name, monthlyLimit) => {
  const { key, prefix, hash } = generateApiKey();

  const apiKey = await ApiKey.create({
    userId,
    name,
    keyPrefix: prefix,
    keyHash: hash,
    monthlyLimit: monthlyLimit || 1000
  });

  return {
    id: apiKey._id,
    name: apiKey.name,
    key, // Show once
    prefix: apiKey.keyPrefix,
    message: "Save this API key now. It will not be shown again."
  };
};

const getMyApiKeys = async (userId) => {
  return await ApiKey.find({ userId });
};

const deactivateApiKey = async (userId, apiKeyId) => {
  const apiKey = await ApiKey.findOne({ _id: apiKeyId, userId });
  if (!apiKey) {
    const error = new Error("API key not found");
    error.statusCode = 404;
    throw error;
  }
  apiKey.isActive = false;
  await apiKey.save();
  return apiKey;
};

const deleteApiKey = async (userId, apiKeyId) => {
  const result = await ApiKey.deleteOne({ _id: apiKeyId, userId });
  if (result.deletedCount === 0) {
    const error = new Error("API key not found");
    error.statusCode = 404;
    throw error;
  }
  return { message: "API key deleted" };
};

module.exports = {
  createApiKey,
  getMyApiKeys,
  deactivateApiKey,
  deleteApiKey
};
