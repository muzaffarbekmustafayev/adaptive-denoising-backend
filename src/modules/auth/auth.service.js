const jwt = require("jsonwebtoken");
const User = require("../user/user.model");
const env = require("../../config/env");

const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

const register = async (userData) => {
  const { email, password, fullName } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    email,
    passwordHash: password,
    fullName
  });

  return {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    token: generateToken(user._id)
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  if (user.status === "BLOCKED") {
    const error = new Error("User is blocked");
    error.statusCode = 403;
    throw error;
  }

  user.lastLoginAt = Date.now();
  await user.save();

  return {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    token: generateToken(user._id)
  };
};

module.exports = {
  register,
  login,
  generateToken
};
