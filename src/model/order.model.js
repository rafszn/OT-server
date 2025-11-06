const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    paymentReference: { type: String, required: true, unique: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },

    // Product Snapshot
    product: {
      id: { type: String },
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      images: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      selectedVariants: {
        type: Map,
        of: String,
        default: {},
      },
      deliveryFee: { type: Number, default: 0 },
    },
    calculatedDeliveryFee: { type: Number },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" },

    deliveryLocation: {
      name: { type: String }, //full name of recipient
      email: { type: String },
      country: { type: String, default: "Nigeria" },
      state: { type: String, required: true },
      address: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },

    pickupOnEventDay: { type: Boolean, default: false },

    deliveryStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "completed", "disputed"],
      default: "pending",
    },

    // Timeline array
    timeline: [
      {
        key: { type: String, required: true },
        label: { type: String, required: true },
        description: { type: String },
        completed: { type: Boolean, default: false },
        date: { type: Date, default: null },
      },
    ],
    tracking: {
      courier: { type: String },
      number: { type: String },
    },
  },
  { timestamps: true }
);

// Default timeline
orderSchema.pre("save", function (next) {
  if (this.isNew && (!this.timeline || this.timeline.length === 0)) {
    const createdDate = new Date();
    this.timeline = [
      {
        key: "order_placed",
        label: "Order Placed",
        description: "We've received your order and notified the store.",
        completed: true,
        date: createdDate,
      },
      {
        key: "pending_confirmation",
        label: "Pending Confirmation",
        description: "The store is reviewing and confirming your order.",
        completed: false,
        date: null,
      },
      {
        key: "waiting_to_be_shipped",
        label: "Waiting to be Shipped",
        description: "Your order is being prepared for shipment.",
        completed: false,
        date: null,
      },
      {
        key: "shipped",
        label: "Shipped",
        description: "Your order has been shipped and is on the way.",
        completed: false,
        date: null,
      },
      {
        key: "delivered",
        label: "Delivered",
        description: "Your order has been delivered to the destination.",
        completed: false,
        date: null,
      },
      {
        key: "completed",
        label: "Completed",
        description: "The order process is fully completed.",
        completed: false,
        date: null,
      },
    ];
  }
  next();
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = {
  OrderModel,
};
