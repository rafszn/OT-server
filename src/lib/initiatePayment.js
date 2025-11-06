const { TicketOrderModel } = require("../model/tiket.model");
const asyncHandler = require("./asyncHandler");
const { initializePayment } = require("./initializePayment");

exports.checkout = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    ticketType,
    price,
    quantity,
    total,
    referralCode,
  } = req.body;

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

  const metadata = {
    app: "oth-event",
  };
  const initResponse = await initializePayment({
    email,
    amount: total,
    metadata,
  });

  await TicketOrderModel.create({
    firstName,
    lastName,
    email,
    ticketType,
    price,
    quantity,
    total,
    referralCode,
    paymentReference: initResponse.data.reference,
  });

  res.status(200).json({
    sucess: true,
    authorization_url: initResponse.data.authorization_url,
    reference: initResponse.data.reference,
  });
});
