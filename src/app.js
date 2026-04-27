const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const { errorMiddleware } = require("./middleware/error.middleware");

const authRoutes = require("./modules/auth/auth.routes");
const apiKeyRoutes = require("./modules/apiKey/apiKey.routes");
const audioRoutes = require("./modules/audio/audio.routes");

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/api-keys", apiKeyRoutes);
app.use("/api/audio", audioRoutes);

// Error Handling
app.use(errorMiddleware);

module.exports = app;
