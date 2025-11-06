const bcrypt = require("bcryptjs");
const UserModel = require("../model/user.model");
const CustomError = require("../lib/CustomError");
const asyncHandler = require("../lib/asyncHandler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../lib/genTokens");

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) throw new CustomError("Invalid credentials.", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new CustomError("Invalid credentials.", 401);

  const payload = {
    id: user._id,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "Login successful.",
      accessToken,
    });
});

const getUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await UserModel.findById(userId).select("-password");

  if (!user) throw new CustomError("User not found", 404);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  userLogin,
  getUser,
};
