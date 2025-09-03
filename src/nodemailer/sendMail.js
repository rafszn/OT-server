const dotenv = require("dotenv");
const transporter = require("./config");
dotenv.config();

const sendMail = async ({ html, email, firstName }) => {
  const mailOptions = {
    from: {
      name: "OWERRI TECHIES HANGOUT",
      address: process.env.EMAIL,
    },
    to: email,
    subject: `🎟 Your OTH25 Ticket Confirmation – ${firstName}, You’re In!`,
    html: html,
  };

  try {
    const res = await transporter.sendMail(mailOptions);
    console.log(res);
    return res;
  } catch (error) {
    return error.message;
  }
};

module.exports = sendMail;
