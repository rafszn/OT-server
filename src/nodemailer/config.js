const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Verifying Mail Service
transporter.verify(function (error) {
  if (error) {
    console.error("Error configuring mail service:", error.message);
  } else {
    console.log("mail service is ready ✔");
  }
});

module.exports = transporter;
