const apiKeyService = require("./apiKey.service");

const createApiKey = async (req, res, next) => {
  try {
    const { name, monthlyLimit } = req.body;
    const result = await apiKeyService.createApiKey(req.user._id, name, monthlyLimit);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getMyApiKeys = async (req, res, next) => {
  try {
    const result = await apiKeyService.getMyApiKeys(req.user._id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deactivateApiKey = async (req, res, next) => {
  try {
    const result = await apiKeyService.deactivateApiKey(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteApiKey = async (req, res, next) => {
  try {
    const result = await apiKeyService.deleteApiKey(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApiKey,
  getMyApiKeys,
  deactivateApiKey,
  deleteApiKey
};
