const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      value: {
        type: Number,
        min: 0,
        default: 0,
      },
      code: {
        type: String,
        trim: true,
      },
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      validate: {
        validator: (val) => Array.isArray(val) && val.length > 0,
        message: "At least one product image is required",
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: String,
      enum: ["NGN", "GYD"],
      required: true,
    },
    variants: [
      {
        type: { type: String, required: true },
        values: [{ type: String, required: true }],
      },
    ],
    delivery: {
      fee: { type: Number, required: true, min: 0 },
      timeEstimate: { type: String, required: true },
      terms: { type: String },
    },

    // used product fields
    productType: {
      type: String,
      enum: ["NEW", "USED"],
      default: "NEW",
    },
    condition: {
      type: String,
      enum: ["EXCELLENT", "GOOD", "FAIR"],
      required: function () {
        return this.productType === "USED";
      },
    },
    reasonForSelling: {
      type: String,
      required: function () {
        return this.productType === "USED";
      },
    },
    video: {
      url: { type: String },
      publicId: { type: String },
    },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: function () {
        return this.productType === "USED" ? "PENDING" : "APPROVED";
      },
    },
    usageDuration: {
      type: String, // e.g. "6 months", "1 year"
    },
    flagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
