require("dotenv").config();
const crypto = require("crypto");
const asyncHandler = require("./asyncHandler");
const verifyPaystackReference = require("./verifyPaystackReference");
const { processTicketOrder, processStoreOrder } = require("../services/orders");

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

  if (event.event !== "charge.success") {
    return res.status(200).send("Webhook ignored");
  }

  const metadata = event.data.metadata;
  const reference = event.data.reference;

  let result;

  switch (metadata.app) {
    case "oth-shop":
      result = await processStoreOrder(reference);
      break;
    case "oth-event":
      result = await processTicketOrder(reference);
      break;
    default:
      console.log("Unknown app in metadata");
  }

  if (!result.ok) {
    return res.status(400).json(result);
  }

  return res.status(200).send("Webhook received");
});
