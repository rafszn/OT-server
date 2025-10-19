const dotenv = require("dotenv");
const resend = require("../lib/resend/config");
dotenv.config();

const sendConfirmationMail = async ({ html, email, firstName }) => {
  const mailOptionsResend = {
    from: "OWERRI TECHIES HANGOUT <support@votenaija.ng>",
    to: [email],
    subject: `Thank you for reaching out – ${firstName}`,
    html: html,
  };

  try {
    await resend.emails.send(mailOptionsResend);
    return res;
  } catch (error) {
    return error.message;
  }
};

module.exports = sendConfirmationMail;
