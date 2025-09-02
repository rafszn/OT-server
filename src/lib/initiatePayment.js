const { TicketOrderModel } = require("../model/tiket.model");
const asyncHandler = require("./asyncHandler");
const { initializePayment } = require("./initializePayment");
const crypto = require("crypto");

exports.checkout = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, ticketType, price, quantity, total } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !ticketType ||
    !price ||
    !quantity ||
    !total
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const reference = crypto.randomBytes(8).toString("hex");

  await TicketOrderModel.create({
    firstName,
    lastName,
    email,
    ticketType,
    price,
    quantity,
    total,
    paymentReference: reference,
  });

  const metadata = {};
  const initResponse = await initializePayment({
    email,
    amount: total,
    metadata,
  });

  res.status(200).json({
    sucess: true,
    authorization_url: initResponse.data.authorization_url,
    reference: initResponse.data.reference,
  });
});
