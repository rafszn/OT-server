const crypto = require("crypto");

function generateTicketCode() {
  return "OTH-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

module.exports = generateTicketCode;
