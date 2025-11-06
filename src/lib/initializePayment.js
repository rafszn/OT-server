const axios = require("axios");
require("dotenv").config();

const PAYSTACK_BASE_URL = "https://api.paystack.co";

exports.initializePayment = async ({ email, amount, metadata }) => {
  const callback =
    metadata?.app === "oth-shop"
      ? `https://owerritechies.com/checkout/shop`
      : `https://owerritechies.com/checkout`;
  const response = await axios.post(
    `${PAYSTACK_BASE_URL}/transaction/initialize`,
    {
      email,
      amount: amount * 100,
      metadata,
      callback_url: callback,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
