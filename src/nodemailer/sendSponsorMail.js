const dotenv = require("dotenv");
const transporter = require("./config");
dotenv.config();

const sendSponsorMail = async ({ html }) => {
  const mailOptions = {
    from: {
      name: "OWERRI TECHIES HANGOUT",
      address: process.env.EMAIL,
    },
    to: "Owerritechies@gmail.com",
    subject: `New Sponsorship Request`,
    html: html,
  };

  try {
    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error) {
    return error.message;
  }
};

module.exports = sendSponsorMail;
