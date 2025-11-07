const dotenv = require("dotenv");
const resend = require("../lib/resend/config");
dotenv.config();

const sendScholarshipMail = async ({ html }) => {
  const mailOptionsResend = {
    from: "OWERRI TECHIES HANGOUT <support@owerritechies.com>",
    to: ["Owerritechies@gmail.com"],
    subject: `New Scholarship Request`,
    html: html,
  };

  try {
    await resend.emails.send(mailOptionsResend);
  } catch (error) {
    return error.message;
  }
};

module.exports = sendScholarshipMail;
