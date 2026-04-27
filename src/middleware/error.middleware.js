const logger = require("../config/logger");
const env = require("../config/env");

const errorMiddleware = (err, req, res, next) => {
  logger.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: env.NODE_ENV === "development" ? err.stack : undefined
  });
};

module.exports = { errorMiddleware };
