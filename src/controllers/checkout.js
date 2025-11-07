const asyncHandler = require("../lib/asyncHandler");
const CustomError = require("../lib/customError");
const { initializePayment } = require("../lib/initializePayment");
const { OrderModel } = require("../model/order.model");
const ProductModel = require("../model/product.model");

generateReference = () => {
  const timestamp = Date.now().toString(36);
  return `OT-${timestamp}`;
};

exports.checkout = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    address,
    phone,
    state,
    city,
    pickupOnEventDay = false,
    product,
  } = req.body;

  if (!product || !product.productId)
    throw new CustomError("Product info missing.", 400);

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !state ||
    !city ||
    !address
  )
    throw new CustomError("Delivery information incomplete.", 400);

  const { productId, quantity, selectedVariants } = product;

  if (!quantity || quantity < 1)
    throw new CustomError("Quantity must be at least 1", 400);

  const productDoc = await ProductModel.findById(productId);
  if (!productDoc) throw new CustomError("Product not found", 404);

  const {
    name,
    description,
    price,
    images,
    delivery: { fee },
    currency = "NGN",
  } = productDoc;

  const CUTOFF = new Date("2025-11-21");
  let pickupOnEventDayFinal = pickupOnEventDay;

  if (Date.now() > CUTOFF) {
    pickupOnEventDayFinal = true;
  }

  const finalDeliveryFee = pickupOnEventDayFinal ? 0 : fee || 0;

  const amount = price * quantity + finalDeliveryFee;

  const metadata = {
    app: "oth-shop",
  };

  const response = await initializePayment({
    email,
    amount,
    metadata,
  });

  const orderData = {
    paymentReference: response.data.reference,
    amount,
    quantity,
    currency,
    pickupOnEventDay: pickupOnEventDayFinal,
    calculatedDeliveryFee: finalDeliveryFee,
    product: {
      id: productId,
      name,
      description,
      price,
      images,
      selectedVariants: selectedVariants || {},
      deliveryFee: fee || 0,
    },
    deliveryLocation: {
      name: `${firstName} ${lastName}`,
      email,
      state: `${city} ${state}`,
      address: address,
      phoneNumber: phone,
    },
  };

  await OrderModel.create(orderData);

  return res.status(201).json({
    success: true,
    authorization_url: response.data.authorization_url,
    reference: response.data.reference,
  });
});
