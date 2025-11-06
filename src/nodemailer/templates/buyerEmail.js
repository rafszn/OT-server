exports.BUYER_ORDER_RECIEVEDHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Confirmation</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="background-color: #ffffff; border-radius: 8px; padding: 20px"
          >
            <!-- Header -->
            <tr>
              <td align="left" style="padding: 20px 0">
                <img
                  src="https://owerritechies.com/favicon.webp"
                  alt="owerri techies"
                  style="height: 50px; margin-left: -4px"
                />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td
                style="
                  font-size: 24px;
                  color: #000000;
                  padding-bottom: 10px;
                "
              >
                We’ve received your order! 🎉
              </td>
            </tr>

            <!-- Greeting & Message -->
            <tr>
              <td style="font-size: 16px; color: #000000; padding-bottom: 20px">
                Hi <strong>[USER_NAME]</strong>,<br /><br />
                We're excited to confirm that your order
                <strong>#[Order ID]</strong> has been received and is being
                prepared with care. We'll notify you once it's on its way to
                you.
              </td>
            </tr>

            <!-- Order Status -->
            <tr>
              <td
                style="font-size: 16px; font-weight: bold; padding-bottom: 10px"
              >
                Order Status:
              </td>
            </tr>
            <tr>
              <td>
                <span
                  style="
                    background-color: #fde68a;
                    color: #db9513;
                    padding: 6px 12px;
                    border-radius: 4px;
                    display: inline-block;
                    font-size: 14px;
                  "
                >
                  [ORDER_STATUS]
                </span>
              </td>
            </tr>

            <!-- Order Summary -->
            <tr>
              <td
                style="font-size: 16px; font-weight: bold; padding: 20px 0 10px"
              >
                Order Summary
              </td>
            </tr>

            [ORDER_ITEMS]

            <!-- Subtotal & Total -->
            <tr>
              <td>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="font-size: 14px; color: #000000"
                >
                  <tr>
                    <td>Subtotal</td>
                    <td align="right">[SUBTOTAL]</td>
                  </tr>
                  <tr>
                    <td>Delivery fee</td>
                    <td align="right">[DELIVERY_FEE]</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold">Total</td>
                    <td align="right" style="font-weight: bold">[TOTAL]</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding: 30px 0">
                <a
                  href="https://owerritechies.com/orders"
                  style="
                    background-color: #6A0DAD;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    display: inline-block;
                    font-weight: bold;
                    width: 90%;
                  "
                >
                  View order status
                </a>
              </td>
            </tr>

            <!-- Closing -->
            <tr>
              <td style="font-size: 14px; color: #000000">
                Best regards,<br />
                <strong>Owerri techies Team</strong>
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              margin-top: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 20px;
            "
          >
            <tr>
              <td style="font-size: 14px; color: #555555; padding-bottom: 10px">
                Do you have questions or concerns? Get in touch with us through
                our social media channels or send a mail to
                <a href="mailto:info@rapid-minds.com" style="color: #1a73e8"
                  >info@rapid-mind.com</a
                >.
              </td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #555555; padding-bottom: 1rem">
                Don’t want any more emails?
                <a href="#" style="color: #1a73e8">Unsubscribe</a>.
              </td>
            </tr>
            <tr>
              <td style="border-top: 1px solid #ddd; height: 20px"></td>
            </tr>

            <tr>
              <td>
                <a href="">
                  <img
                    src="https://owerritechies.com/favicon.webp"
                    alt="Bisven"
                    style="height: 50px; margin-left: -4px"
                /></a>
              </td>
            </tr>
            <tr>
              <td align="center">
                <br />
                <a
                  href="#"
                  style="
                    color: #1a73e8;
                    font-size: 12px;
                    text-decoration: none;
                    margin: 0 5px;
                    text-decoration: underline;
                  "
                  >Terms of Use</a
                >
                |
                <a
                  href="#"
                  style="
                    color: #1a73e8;
                    font-size: 12px;
                    text-decoration: none;
                    margin: 0 5px;
                    text-decoration: underline;
                  "
                  >Privacy Policy</a
                >
                |
                <span style="font-size: 12px; color: #555"
                  >Copyright ©2025.
                  <span style="text-decoration: underline; color: #1a73e8"
                    >All rights reserved</span
                  ></span
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

exports.SELLER_ORDER_CREATEDHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Order Received</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="background-color: #ffffff; border-radius: 8px; padding: 20px"
          >
            <!-- Header -->
            <tr>
              <td align="left" style="padding: 20px 0">
                <img
                  src="https://owerritechies.com/favicon.webp"
                  alt="ow"
                  style="height: 50px; margin-left: -4px"
                />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="font-size: 24px; color: #000000; padding-bottom: 10px">
                You’ve got a new order! 🚀
              </td>
            </tr>

            <!-- Greeting & Message -->
            <tr>
              <td style="font-size: 16px; color: #000000; padding-bottom: 20px">
                Hi <strong>[SELLER_NAME]</strong>,<br /><br />
                Great news! <strong>[BUYER_NAME]</strong> just placed a new
                order on your store <strong>[STORE_NAME]</strong>.<br /><br />
                Order ID: <strong>#[ORDER_ID]</strong>
              </td>
            </tr>

            <!-- Order Details -->
            <tr>
              <td
                style="font-size: 16px; font-weight: bold; padding-bottom: 10px"
              >
                Order Summary
              </td>
            </tr>
            <!-- Total -->
            <tr>
              <td>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="font-size: 14px; color: #000000"
                >
                  <tr>
                    <td align="left">Subtotal</td>
                    <td align="right">[SUBTOTAL]</td>
                  </tr>
                  <tr>
                    <td align="left">Delivery fee</td>
                    <td align="right">[DELIVERY_FEE]</td>
                  </tr>
                  <tr>
                    <td align="left" style="font-weight: bold">Total</td>
                    <td align="right" style="font-weight: bold">[TOTAL]</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding: 30px 0">
                <a
                  href="https://owerritechies.com/v1/console"
                  style="
                    background-color: #6a0dad;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    display: inline-block;
                    font-weight: bold;
                    width: 90%;
                  "
                >
                  View order details
                </a>
              </td>
            </tr>

            <!-- Reminder -->
            <tr>
              <td
                style="
                  font-size: 14px;
                  color: #000000;
                  background-color: #fff5f5;
                  padding: 15px;
                  border-radius: 6px;
                  line-height: 1.5;
                "
              >
                ⚠️ Please ensure you prepare and ship this order promptly to
                maintain great customer satisfaction.
              </td>
            </tr>

            <!-- Closing -->
            <tr>
              <td style="font-size: 14px; color: #000000; padding-top: 20px">
                Best regards,<br />
                <strong>Owerri techies Team</strong>
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              margin-top: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 20px;
            "
          >
            <tr>
              <td style="font-size: 14px; color: #555555; padding-bottom: 10px">
                Need help? Reach out to our support team at
                <a href="mailto:info@rapid-minds.com" style="color: #1a73e8"
                  >info@rapid-mind.com</a
                >.
              </td>
            </tr>
            <tr>
              <td style="border-top: 1px solid #ddd; height: 20px"></td>
            </tr>

            <tr>
              <td>
                <a href="">
                  <img
                    src="https://owerritechies.com/favicon.webp"
                    alt="ow"
                    style="height: 50px; margin-left: -4px"
                  />
                </a>
              </td>
            </tr>
            <tr>
              <td align="center">
                <br />
                <a
                  href="#"
                  style="
                    color: #1a73e8;
                    font-size: 12px;
                    text-decoration: underline;
                    margin: 0 5px;
                  "
                  >Terms of Use</a
                >
                |
                <a
                  href="#"
                  style="
                    color: #1a73e8;
                    font-size: 12px;
                    text-decoration: underline;
                    margin: 0 5px;
                  "
                  >Privacy Policy</a
                >
                |
                <span style="font-size: 12px; color: #555"
                  >Copyright ©2025.
                  <span style="text-decoration: underline; color: #1a73e8"
                    >All rights reserved</span
                  ></span
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
