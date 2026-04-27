const crypto = require("crypto");
const env = require("../config/env");

const generateApiKey = () => {
  const secret = crypto.randomBytes(32).toString("hex");
  const prefix = env.API_KEY_PREFIX || "adn_live";
  const key = `${prefix}_${secret}`;
  
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  
  return {
    key, // This is shown to user only once
    prefix: `${prefix}_${secret.substring(0, 6)}`,
    hash
  };
};

const hashApiKey = (key) => {
  return crypto.createHash("sha256").update(key).digest("hex");
};

module.exports = {
  generateApiKey,
  hashApiKey
};
