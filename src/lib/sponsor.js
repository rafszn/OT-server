const sendConfirmationMail = require("../nodemailer/sendConfirmationMail");
const sendGiveawayMail = require("../nodemailer/sendGiveawayMail");
const sendScholarshipMail = require("../nodemailer/sendScholarshipMail");
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

exports.scholarship = asyncHandler(async (req, res) => {
  const {
    lastName,
    firstName,
    email,
    ticketCode,
    hasTicket,
    course,
    reason,
    benefit,
    isImoState,
    address,
  } = req.body;

  // ✅ REQUIRED FIELDS
  if (!lastName || !firstName || !email) {
    return res.status(400).json({
      success: false,
      message: "Last name, first name, email are required.",
    });
  }

  // ✅ Admin email template
  const scholarshipHTML = `
    <h2>New Scholarship Request</h2>

    <p><strong>Last Name:</strong> ${lastName}</p>
    <p><strong>First Name:</strong> ${firstName}</p>
    <p><strong>Email:</strong> ${email}</p>


    <p><strong>Has Ticket:</strong> ${hasTicket || "N/A"}</p>
    <p><strong>Ticket Code:</strong> ${ticketCode || "N/A"}</p>

    <p><strong>Course:</strong> ${course || "N/A"}</p>
    <p><strong>Reason for Course:</strong> ${reason || "N/A"}</p>
    <p><strong>How it helps:</strong> ${benefit || "N/A"}</p>

    <p><strong>Based in Imo State:</strong> ${isImoState || "N/A"}</p>
    <p><strong>Address:</strong> ${address || "N/A"}</p>
  `;

  // ✅ User confirmation template
  const html = `
    <h2>Hi ${firstName},</h2>
    <p>Thank you for applying for the scholarship. We have successfully received your application.</p>
    <p>Our team will review your submission and get back to you shortly.</p>
    <p>Best regards,<br/>Scholarship Team</p>
  `;

  await sendConfirmationMail({ html, email, firstName });
  await sendScholarshipMail({ html: scholarshipHTML });

  res.status(200).json({
    success: true,
    message: "Scholarship request submitted successfully.",
  });
});


exports.giveaway = asyncHandler(async (req, res) => {
  const {
    lastName,
    firstName,
    email,
    ticketCode,
    hasTicket,
    laptopReason,
    benefit,
    isImoState,
    address,
  } = req.body;

  // ✅ REQUIRED FIELDS
  if (!lastName || !firstName || !email) {
    return res.status(400).json({
      success: false,
      message: "Last name, first name, email are required.",
    });
  }

  // ✅ Admin email template
  const giveawayHTML = `
    <h2>New Scholarship Request</h2>

    <p><strong>Last Name:</strong> ${lastName}</p>
    <p><strong>First Name:</strong> ${firstName}</p>
    <p><strong>Email:</strong> ${email}</p>


    <p><strong>Has Ticket:</strong> ${hasTicket || "N/A"}</p>
    <p><strong>Ticket Code:</strong> ${ticketCode || "N/A"}</p>

    <p><strong>Reason for Laptop:</strong> ${laptopReason || "N/A"}</p>
    <p><strong>How it helps:</strong> ${benefit || "N/A"}</p>

    <p><strong>Based in Imo State:</strong> ${isImoState || "N/A"}</p>
    <p><strong>Address:</strong> ${address || "N/A"}</p>
  `;

  // ✅ User confirmation template
  const html = `
    <h2>Hi ${firstName},</h2>
    <p>Thank you for applying for the giveaway. We have successfully received your application.</p>
    <p>Our team will review your submission and get back to you shortly.</p>
    <p>Best regards,<br/>Giveaway Team</p>
  `;

  await sendConfirmationMail({ html, email, firstName });
  await sendGiveawayMail({ html: giveawayHTML });

  res.status(200).json({
    success: true,
    message: "Scholarship request submitted successfully.",
  });
});
