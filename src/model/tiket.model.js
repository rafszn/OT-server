const mongoose = require("mongoose");

const TicketOrderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    ticketType: { type: String, enum: ["basic", "premium"], required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    paymentReference: { type: String, required: true, unique: true }, // from Paystack
  },
  { timestamps: true }
);

const TicketSchema = new mongoose.Schema(
  {
    ticketCode: { type: String, required: true, unique: true },
    ticketType: { type: String, required: true },
    price: { type: Number, required: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketOrder",
      required: true,
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TicketModel = mongoose.model("Ticket", TicketSchema);
const TicketOrderModel = mongoose.model("TicketOrder", TicketOrderSchema);

module.exports = {
  TicketModel,
  TicketOrderModel,
};
