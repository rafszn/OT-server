require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./lib/connectDB");

const cookieParser = require("cookie-parser");
const corsOptions = require("./lib/corsOptions");
const notFound = require("./lib/notFound");
const { checkout } = require("./lib/initiatePayment");
const {
  handlePaystackWebhook,
  handlePaystackCallback,
} = require("./lib/handlePaystackWebhook");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json({
    message: "OTH SERVER",
  });
});

app.post(
  "/v1/checkout/paystack/webhook",
  express.raw({ type: "application/json" }),
  handlePaystackWebhook
);

//routes
app.use(express.json());
app.post("/v1/checkout", checkout);
app.get("/v1/checkout/callback", handlePaystackCallback);

//404 route
app.use(notFound);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("server is on ✔");
  } catch (error) {
    console.error("Server error", error);
    process.exit(1);
  }
});
