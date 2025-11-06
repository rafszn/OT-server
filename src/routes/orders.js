const express = require("express");
const verifyAuthToken = require("../middlewares/verifyAuthToken");
const {
  getOrderById,
  getOrders,
  updateSuborderTimeline,
} = require("../controllers/orders");
const router = express.Router();

router.get("/", verifyAuthToken, getOrders);
router.get("/:id", verifyAuthToken, getOrderById);
router.post("/timeline/:subOrderId", verifyAuthToken, updateSuborderTimeline);

module.exports = router;
