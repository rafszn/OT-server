const dotenv = require("dotenv");
const transporter = require("./config");
dotenv.config();

const sendConfirmationMail = async ({ html, email, firstName }) => {
  const mailOptions = {
    from: {
      name: "OWERRI TECHIES HANGOUT",
      address: process.env.EMAIL,
    },
    to: email,
    subject: `Thank you for reaching out – ${firstName}`,
    html: html,
  };

  try {
    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error) {
    return error.message;
  }
};

module.exports = sendConfirmationMail;
