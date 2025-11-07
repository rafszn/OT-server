const dotenv = require("dotenv");
const resend = require("../lib/resend/config");
dotenv.config();

const sendBuyerOrderCreatedMail = async ({ html, email }) => {
  const mailOptionsResend = {
    from: "OWERRI TECHIES HANGOUT <support@owerritechies.com>",
    to: [email],
    subject: `Thank you for your purchase`,
    html: html,
  };

  try {
    await resend.emails.send(mailOptionsResend);
    return res;
  } catch (error) {
    return error.message;
  }
};

module.exports = sendBuyerOrderCreatedMail;
