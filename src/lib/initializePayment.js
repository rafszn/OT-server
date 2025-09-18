const axios = require("axios");
require("dotenv").config();

const PAYSTACK_BASE_URL = "https://api.paystack.co";

exports.initializePayment = async ({ email, amount, metadata }) => {
  const response = await axios.post(
    `${PAYSTACK_BASE_URL}/transaction/initialize`,
    {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      metadata,
      callback_url: `https://owerritechies.com/checkout`,
      // callback_url: `http://localhost:5173/checkout`,
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
