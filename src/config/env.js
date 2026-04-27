require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/audio_denoising",
  JWT_SECRET: process.env.JWT_SECRET || "change_me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  API_KEY_PREFIX: process.env.API_KEY_PREFIX || "adn_live",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
  MAX_AUDIO_FILE_MB: process.env.MAX_AUDIO_FILE_MB || 50,
  WORKER_CONCURRENCY: process.env.WORKER_CONCURRENCY || 2,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*"
};
