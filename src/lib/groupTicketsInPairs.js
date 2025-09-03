function groupTickets(tickets) {
  const pairs = [];
  for (let i = 0; i < tickets.length; i += 2) {
    pairs.push(tickets.slice(i, i + 2));
  }
  return pairs;
}

function generateTicketRows(tickets) {
  const ticketPairs = groupTickets(tickets);
  let rows = "";

  ticketPairs.forEach((pair) => {
    rows += `
      <tr>
        ${pair
          .map(
            (ticket) => `
          <td
            style="
              border: 2px dashed #333;
              border-radius: 6px;
              padding: 15px;
              text-align: center;
              background: #f9f9f9;
              width: 50%;
            "
          >
            <strong>${ticket.ticketType} Ticket</strong><br />
            Code:
            <span style="font-size: 16px; color: #d9534f">${ticket.ticketCode}</span>
          </td>
        `
          )
          .join("")}
        ${
          pair.length === 1 ? "<td style='width:50%;'></td>" : ""
        } <!-- filler if odd -->
      </tr>
    `;
  });

  return rows;
}

module.exports = { generateTicketRows, groupTickets };
