const { findByEmail } = require("../App/Users/services");

const jwt = require("jsonwebtoken");
const environment = require("dotenv");

environment.config;

exports.authenticateToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
  if (token && token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};

exports.uploadFileValidator = (req, res, next) => {
  if (!req.files) {
    return res.status(401).json({
      status: false,
      message: "No file uploaded",
    });
  }
  next();
};

exports.existingUserValidator = async (req, res, next) => {
  const { email } = req.body;
  const user = await findByEmail(email);
  if (user) {
    return res.status(409).json({
      status: false,
      errEmail: "Email already Taken",
    });
  }
  next();
};

exports.registerUserBodyValidator = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      status: false,
      message: "Email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      status: false,
      message: "Password is not supplied",
    });
  }
  if (!name) {
    return res.status(400).json({
      status: false,
      message: "Name is required",
    });
  }
  next();
};
