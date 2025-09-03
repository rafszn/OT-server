const crypto = require("crypto");
require("dotenv").config();
const { TicketOrderModel, TicketModel } = require("../model/tiket.model");
const generateTicketCode = require("./generateTicketCode");
const asyncHandler = require("./asyncHandler");
const verifyPaystackReference = require("./verifyPaystackReference");
const { generateTicketRows } = require("./groupTicketsInPairs");
const sendMail = require("../nodemailer/sendMail");
const { capitalizeString } = require("./capString");

exports.handlePaystackWebhook = asyncHandler(async (req, res) => {
  const paystackSignature = req.headers["x-paystack-signature"];
  const secret = process.env.PAYSTACK_SECRET_KEY;

  // Verify signature
  const hash = crypto
    .createHmac("sha512", secret)
    .update(req.body)
    .digest("hex");

  if (hash !== paystackSignature) {
    return res.status(400).send("Invalid signature");
  }

  const event = JSON.parse(req.body.toString());

  console.log("Paystack webhook event:", event.event);

  if (event.event === "charge.success") {
    const reference = event.data.reference;

    // 1. Find order by reference
    const order = await TicketOrderModel.findOne({
      paymentReference: reference,
    });

    if (!order) {
      console.error("Order not found for reference:", reference);
      return res.status(404).send("Order not found");
    }

    // 2. If already paid, return early (idempotency)
    if (order.status === "paid") {
      console.log("Order already processed:", reference);
      return res.status(200).send("Order already processed");
    }

    // 3. Update order status to paid
    order.status = "paid";
    await order.save();

    // 4. Generate tickets based on quantity
    const tickets = [];
    for (let i = 0; i < order.quantity; i++) {
      const ticketCode = generateTicketCode();

      tickets.push({
        order: order._id,
        ticketCode,
        ticketType: order.ticketType,
        price: order.price,
        isUsed: false,
        email: order.email,
      });
    }

    await TicketModel.insertMany(tickets);

    const ticketRows = generateTicketRows(tickets);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Ticket Receipt</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border:1px solid #eee;padding:20px;border-radius:8px;">
    <h2 style="text-align:center;color:#333;margin-top:0">🎟 Your Ticket Receipt</h2>
    <p style="text-align:center;color:#555;font-size:14px">
      Hello <strong>${capitalizeString(order.firstName)} ${capitalizeString(
      order.lastName
    )}</strong>, thank you for your purchase! Below are your ticket details:
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="8" border="0" style="margin:20px 0;border:1px solid #ddd;border-radius:6px;">
      <tr><td style="font-size:14px;color:#555">Ticket Type:</td><td style="font-size:14px;font-weight:bold;color:#333">${
        order.ticketType
      }</td></tr>
       <tr>
          <td style="font-size: 14px; color: #555">Price per ticket:</td>
          <td style="font-size: 14px; font-weight: bold; color: #333">
            ₦${order.price.toLocaleString()}
          </td>
        </tr>
      <tr><td style="font-size:14px;color:#555">Quantity:</td><td style="font-size:14px;font-weight:bold;color:#333">${tickets.length?.toLocaleString()}</td></tr>
      <tr><td style="font-size:14px;color:#555">Total Paid:</td><td style="font-size:14px;font-weight:bold;color:#333">₦${order.total.toLocaleString()}</td></tr>
    </table>

    <h3 style="margin-top:20px;color:#333">🎟 Your Tickets</h3>
    <table role="presentation" width="100%" cellspacing="10" cellpadding="0" border="0">
      ${ticketRows}
    </table>

    <hr style="margin:20px 0" />
    <p style="font-size:12px;color:#777;text-align:center">
      Please present your ticket code(s) at the entrance. Each code admits one person.<br />
      For help, contact <a href="mailto:support@bizvim.com">support@bizvim.com</a>
    </p>
  </div>
</body>
</html>
`;
    await sendMail({ html, email: order.email, firstName: order.firstName });
  }

  return res.status(200).send("Webhook received");
});

exports.handlePaystackCallback = asyncHandler(async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    throw new CustomError("Payment reference is required", 400);
  }

  const paymentData = await verifyPaystackReference(reference);

  return res.status(200).json({
    success: true,
    paymentStatus: paymentData.status,
    message:
      paymentData.status === "success"
        ? "Payment successful"
        : "Payment not successful",
  });
});
