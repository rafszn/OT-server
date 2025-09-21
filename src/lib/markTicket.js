const { TicketModel } = require("../model/tiket.model");

exports.markTicketAsUsed = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      ticketId,
      { isUsed: true },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(updatedTicket);
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
