const { capitalizeString } = require("../lib/capString");
const generateTicketCode = require("../lib/generateTicketCode");
const { OrderModel } = require("../model/order.model");
const ProductModel = require("../model/product.model");
const { TicketOrderModel, TicketModel } = require("../model/tiket.model");
const sendBuyerOrderCreatedMail = require("../nodemailer/sendBuyerOrderCreatedMail");
const sendMail = require("../nodemailer/sendMail");
const sendSellerOrderCreatedMail = require("../nodemailer/sendSellerOrderCreatedMail");
const {
  BUYER_ORDER_RECIEVEDHtml,
  SELLER_ORDER_CREATEDHtml,
} = require("../nodemailer/templates/buyerEmail");

const generateTicketRows = (tickets) =>
  tickets
    .map(
      (ticket) => `
      <tr>
        <td style="padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;color:#555;">
          <strong>${ticket.ticketCode}</strong>
        </td>
      </tr>
      `
    )
    .join("");

const createItemHtml = (product, item) => `
      <tr>
        <td>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="50" style="vertical-align: top">
                <div style="
                  width: 50px;
                  height: 50px;
                  background: url('${
                    product.images?.[0]?.url || ""
                  }') no-repeat bottom center;
                  background-size: cover;
                  border-radius: 4px;">
                </div>
              </td>
              <td style="padding-left: 10px; font-size: 14px; color: #000000;">
                ${product.name} x${item.quantity}<br/>
                <strong style="font-size: 16px;">
                  NGN${(product.price * item.quantity).toLocaleString()}
                </strong>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="height: 10px;"></td></tr>
    `;

async function processTicketOrder(reference) {
  try {
    // 1. Find order
    const order = await TicketOrderModel.findOne({
      paymentReference: reference,
    });

    if (!order) {
      return {
        ok: false,
        message: "Order not found",
        code: "ORDER_NOT_FOUND",
      };
    }

    // 2. Idempotency check
    if (order.status === "paid") {
      return {
        ok: true,
        message: "Order already processed",
        code: "ALREADY_PAID",
      };
    }

    // 3. Mark as paid
    order.status = "paid";
    await order.save();

    // 4. Create tickets
    const tickets = [];
    for (let i = 0; i < order.quantity; i++) {
      tickets.push({
        order: order._id,
        ticketCode: generateTicketCode(),
        ticketType: order.ticketType,
        price: order.price,
        isUsed: false,
        email: order.email,
      });
    }

    await TicketModel.insertMany(tickets);

    // 5. Email HTML
    const ticketRows = generateTicketRows(tickets);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Ticket Receipt</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border:1px solid #eee;padding:20px;border-radius:8px;">
    <h2 style="text-align:center;color:#333;margin-top:0">🎟 Your Ticket Receipt</h2>
    <p style="text-align:center;color:#555;font-size:14px">
      Hello <strong>${capitalizeString(order.firstName)} ${capitalizeString(
      order.lastName
    )}</strong>, thank you for your purchase! Below are your ticket details:
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="8" border="0" style="margin:20px 0;border:1px solid #ddd;border-radius:6px;">
      <tr><td style="font-size:14px;color:#555">Ticket Type:</td><td style="font-size:14px;font-weight:bold;color:#333">${
        order.ticketType
      }</td></tr>
       <tr>
          <td style="font-size: 14px; color: #555">Price per ticket:</td>
          <td style="font-size: 14px; font-weight: bold; color: #333">
            ₦${order.price.toLocaleString()}
          </td>
        </tr>
      <tr><td style="font-size:14px;color:#555">Quantity:</td><td style="font-size:14px;font-weight:bold;color:#333">${tickets.length?.toLocaleString()}</td></tr>
      <tr><td style="font-size:14px;color:#555">Total Paid:</td><td style="font-size:14px;font-weight:bold;color:#333">₦${order.total.toLocaleString()}</td></tr>
    </table>

    <h3 style="margin-top:20px;color:#333">🎟 Your Tickets</h3>
    <table role="presentation" width="100%" cellspacing="10" cellpadding="0" border="0">
      ${ticketRows}
    </table>

    <hr style="margin:20px 0" />
    <p style="font-size:12px;color:#777;text-align:center">
      Please present your ticket code(s) at the entrance. Each code admits one person.<br />
      For help, contact <a href="mailto:info@rapid-minds.com">info@rapid-minds.com</a>
    </p>
     <p style="font-size: 10px; color: #777; text-align: center">
        Proudly powered by RM-Studios<br />
        <a href="https://rapid-minds.com">rapid-minds.com</a>
      </p>
  </div>
</body>
</html>
`;

    await sendMail({
      html,
      email: order.email,
      firstName: order.firstName,
    });

    return {
      ok: true,
      message: "Order processed successfully",
      code: "SUCCESS",
      data: { orderId: order._id },
    };
  } catch (err) {
    console.error(err);

    return {
      ok: false,
      message: err?.message || "Unknown Error",
      code: "ERROR",
    };
  }
}

const processStoreOrder = async (reference) => {
  try {
    const order = await OrderModel.findOne({
      paymentReference: reference,
    });

    if (!order) {
      return {
        ok: false,
        message: "Order not found",
        code: "ORDER_NOT_FOUND",
      };
    }

    if (order.paymentStatus === "successful") {
      return {
        ok: true,
        message: "Order already processed",
        code: "ALREADY_PROCESSED",
        data: { orderId: order._id },
      };
    }

    const product = await ProductModel.findById(order.product.id);
    if (!product) {
      return {
        ok: false,
        message: "Product not found for the order",
        code: "PRODUCT_NOT_FOUND",
      };
    }

    product.quantity = Math.max(0, product.quantity - order.quantity);
    await product.save();

    order.paymentStatus = "successful";

    await order.save();

    const itemsHtml = createItemHtml(order.product, order);

    const subtotal = order.amount - (order?.calculatedDeliveryFee || 0);

    const emailHtml = BUYER_ORDER_RECIEVEDHtml.replace(
      "[USER_NAME]",
      capitalizeString(order.deliveryLocation?.name)
    )
      .replace("[ORDER_STATUS]", "In progress")
      .replace("[Order ID]", order.paymentReference?.toUpperCase())
      .replace("[ORDER_ITEMS]", itemsHtml)
      .replace("[SUBTOTAL]", `NGN${subtotal.toLocaleString()}`)
      .replace(
        "[DELIVERY_FEE]",
        `NGN${(order?.calculatedDeliveryFee || 0).toLocaleString()}`
      )
      .replace("[TOTAL]", `NGN${order.amount.toLocaleString()}`);

    await sendBuyerOrderCreatedMail({
      email: order.deliveryLocation?.email,
      html: emailHtml,
    });

    let html = SELLER_ORDER_CREATEDHtml;
    html = html
      .replace(/\[SELLER_NAME\]/g, "OT Admin")
      .replace(
        /\[BUYER_NAME\]/g,
        capitalizeString(order.deliveryLocation?.name)
      )
      .replace(/\[STORE_NAME\]/g, "OT SHOP")
      .replace(/\[ORDER_ID\]/g, order.paymentReference?.toUpperCase())
      .replace(/\[SUBTOTAL\]/g, `NGN${subtotal.toLocaleString()}`)
      .replace(
        /\[DELIVERY_FEE\]/g,
        `NGN${(order?.calculatedDeliveryFee || 0).toLocaleString()}`
      )
      .replace(/\[TOTAL\]/g, `NGN${order.amount.toLocaleString()}`);

    await sendSellerOrderCreatedMail({
      email: "owerritechies@gmail.com",
      html,
    });

    return {
      ok: true,
      message: "Order processed successfully",
      code: "SUCCESS",
      data: { orderId: order._id },
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: error.message || "Unknown error",
      code: "ERROR",
    };
  }
};

module.exports = { processTicketOrder, processStoreOrder };
