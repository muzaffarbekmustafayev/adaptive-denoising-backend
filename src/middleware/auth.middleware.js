const jwt = require("jsonwebtoken");
const User = require("../modules/user/user.model");
const env = require("../config/env");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const error = new Error("Not authorized to access this route");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (req.user.status === "BLOCKED") {
      const error = new Error("User is blocked");
      error.statusCode = 403;
      return next(error);
    }

    next();
  } catch (err) {
    const error = new Error("Not authorized to access this route");
    error.statusCode = 401;
    return next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(`User role ${req.user.role} is not authorized to access this route`);
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};

module.exports = { protect, authorize };
