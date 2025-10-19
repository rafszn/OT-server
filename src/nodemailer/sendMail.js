const dotenv = require("dotenv");
const resend = require("../lib/resend/config");
dotenv.config();

const sendMail = async ({ html, email, firstName }) => {
  const mailOptionsResend = {
    from: "OWERRI TECHIES HANGOUT <support@votenaija.ng>",
    to: [email],
    subject: `🎟 Your OTH25 Ticket Confirmation – ${firstName}, You’re In!`,
    html: html,
  };

  try {
    await resend.emails.send(mailOptionsResend);
    return res;
  } catch (error) {
    return error.message;
  }
};

module.exports = sendMail;
