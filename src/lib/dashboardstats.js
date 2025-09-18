const { TicketModel, TicketOrderModel } = require("../model/tiket.model");

const getDashboardData = async (req, res) => {
  try {
    // 1️⃣ Get all paid ticket orders
    const paidOrders = await TicketOrderModel.find({ status: "paid" }).select(
      "_id referralCode quantity"
    );

    const paidOrderIds = paidOrders.map((order) => order._id);

    // 2️⃣ Get all tickets linked to paid orders
    const tickets = await TicketModel.find({ order: { $in: paidOrderIds } })
      .select("ticketCode ticketType price isUsed")
      .sort({ createdAt: -1 });

    // 3️⃣ Group referrals
    const referralMap = {};
    paidOrders.forEach((order) => {
      if (order.referralCode) {
        referralMap[order.referralCode] =
          (referralMap[order.referralCode] || 0) + order.quantity;
      }
    });

    const referrals = Object.entries(referralMap).map(
      ([referralCode, totalQuantity]) => ({
        referralCode,
        totalQuantity,
      })
    );

    res.json({ tickets, referrals });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
};

module.exports = { getDashboardData };
