const asyncHandler = require("../lib/asyncHandler");
const CustomError = require("../lib/CustomError");
const { OrderModel } = require("../model/order.model");

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ paymentStatus: "successful" })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: "orders fetched successfully.",
    data: orders,
  });
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await OrderModel.findById(id);
  if (!order) {
    throw new CustomError("Order not found", 404);
  }
  res.status(200).json({ success: true, data: order });
});

exports.updateSuborderTimeline = asyncHandler(async (req, res) => {
  const { subOrderId } = req.params;
  const { stepKey } = req.body;

  const subOrder = await OrderModel.findOne({ _id: subOrderId });

  if (!subOrder) {
    return res.status(404).json({ success: false, message: "order not found" });
  }

  const targetIndex = subOrder.timeline.findIndex((s) => s.key === stepKey);
  if (targetIndex === -1) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid step key" });
  }

  const now = new Date();
  for (let i = 0; i <= targetIndex; i++) {
    if (!subOrder.timeline[i].completed) {
      subOrder.timeline[i].completed = true;
      subOrder.timeline[i].date = now;
    }
  }

  const stepToStatusMap = {
    pending_confirmation: "pending",
    waiting_to_be_shipped: "pending",
    shipped: "shipped",
    delivered: "delivered",
    completed: "completed",
  };

  if (stepToStatusMap[stepKey]) {
    subOrder.deliveryStatus = stepToStatusMap[stepKey];
  }

  await subOrder.save();

  res.status(200).json({
    success: true,
    message: "Timeline & status updated successfully",
    status: subOrder.deliveryStatus,
    timeline: subOrder.timeline,
  });
});
