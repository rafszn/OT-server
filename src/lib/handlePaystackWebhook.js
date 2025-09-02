const crypto = require("crypto");
require("dotenv").config();
const { TicketOrderModel, TicketModel } = require("../model/tiket.model");
const generateTicketCode = require("./generateTicketCode");
const asyncHandler = require("./asyncHandler");
const verifyPaystackReference = require("./verifyPaystackReference");

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
