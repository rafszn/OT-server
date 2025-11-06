const dotenv = require("dotenv");
const resend = require("../lib/resend/config");
dotenv.config();

const sendSellerOrderCreatedMail = async ({ html, email }) => {
  const mailOptionsResend = {
    from: "OWERRI TECHIES HANGOUT <support@votenaija.ng>",
    to: [email],
    subject: `New Order Received`,
    html: html,
  };

  try {
    await resend.emails.send(mailOptionsResend);
    return res;
  } catch (error) {
    return error.message;
  }
};

module.exports = sendSellerOrderCreatedMail;
