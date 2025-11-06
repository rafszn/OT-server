const CustomError = require("../lib/customError");

/* eslint-disable no-unused-vars */
const globalErrorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  console.error(err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = globalErrorHandler;
