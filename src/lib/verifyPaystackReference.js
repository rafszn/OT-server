const axios = require("axios");

async function verifyPaystackReference(reference) {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  if (response.data.status && response.data.data.status === "success") {
    return response.data.data;
  }
  throw new Error("Payment verification failed");
}

module.exports = verifyPaystackReference;
