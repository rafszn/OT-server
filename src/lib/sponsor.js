const sendConfirmationMail = require("../nodemailer/sendConfirmationMail");
const sendSponsorMail = require("../nodemailer/sendSponsorMail");
const asyncHandler = require("./asyncHandler");

exports.sponsor = asyncHandler(async (req, res) => {
  const {
    lastName,
    firstName,
    companyName,
    businessName,
    businessDesc,
    email,
    phoneNumber,
    additionalInfo,
  } = req.body;

  // 1️⃣ VALIDATION
  if (!lastName || !firstName || !email || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Last name, first name, email, and phone number are required.",
    });
  }

  const sponsorHTML = `
      <h2>New Sponsorship/Exhibitor Request</h2>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Company Name/Business Name:</strong> ${
        companyName || businessName || "N/A"
      }</p>
      <p><strong>Business Description:</strong> ${businessDesc || "N/A"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Additional Info:</strong> ${additionalInfo || "N/A"}</p>
    `;

  const html = `
    <h2>Hi ${firstName},</h2>
    <p>Thank you for reaching out! We have received your details and will get back to you shortly.</p>
    <p>Best regards, Sponsor/Exhibitor Team</p>`;

  await sendConfirmationMail({ html, email, firstName });
  await sendSponsorMail({ html: sponsorHTML });

  res.status(200).json({
    success: true,
    message: "Form submitted successfully.",
  });
});
