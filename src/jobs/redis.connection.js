const IORedis = require("ioredis");
const env = require("../config/env");
const logger = require("../config/logger");

const connection = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    // Retry connection after 2, 4, 8... up to 10 seconds
    const delay = Math.min(times * 2000, 10000);
    if (times % 5 === 0) {
      logger.warn(`Redis connection attempt ${times} failed. Retrying in ${delay / 1000}s...`);
    }
    return delay;
  },
  // Prevent AggregateError spam in newer Node versions
  connectTimeout: 5000,
});

connection.on("error", (err) => {
  // We log this via the retryStrategy warning to avoid spamming every second
});

module.exports = connection;
