const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const logger = require("./config/logger");

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    const PORT = env.PORT;
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err, promise) => {
      logger.error(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  } catch (error) {
    logger.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();
