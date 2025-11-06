require("dotenv").config();
const jwt = require("jsonwebtoken");
const CustomError = require("../lib/CustomError");
const UserModel = require("../model/user.model");

const verifyAuthToken = async (req, res, next) => {
  const header = req.headers["x-oth"];

  if (!header || !header.startsWith("Bearer ")) {
    throw new CustomError("Access denied. No token provided.", 401);
  }

  const token = header.split(" ")[1];

  if (!token) {
    throw new CustomError("Access denied. No token provided.", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const payload = {
      ...user.toObject(),
      id: user._id,
    };

    req.user = payload;
    next();
  } catch {
    throw new CustomError("Access denied. expired token.", 401);
  }
};

module.exports = verifyAuthToken;

/**
 * 🔐 Expected from frontend:
 * Send the access token inside a custom header called "x-bisven"
 * Format: "Bearer <access_token>"
 *
 * Example:
 * {
 *   "x-bisven": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * This middleware extracts and verifies the access token using ACCESS_TOKEN_SECRET.
 * If valid, attaches the decoded user payload to req.user.
 */
