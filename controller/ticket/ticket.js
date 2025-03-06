const Ticket = require("../../models/ticket");

const generateTicketId = async () => {
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    let ticketId;
  
    do {
      ticketId = Math.floor(Math.random() * (max - min + 1)) + min;
      const existingTicket = await Ticket.findOne({ where: { ticketId } });
      if (!existingTicket) break; // Ensure the ticketId is unique
    } while (true);
  
    return ticketId.toString();
  };

  const generateCustomId = async () => {
    // Find the last ticket in the database
    const lastTicket = await Ticket.findOne({
        order: [["id", "DESC"]], // Order by `id` in descending order
    });

    let newId = 1; // Starting point for the custom ID

    if (lastTicket) {
        // If there are existing tickets, increment the last `id`
        newId = lastTicket.id + 1;
    }

    return newId; // Return the new `id` as a number
};

const createTicket = async (req, res, next) => {
    try {
        const { title, description, ticketMadeBy } = req.body;

        // List of admins (for now, hardcoded)
        const admins = ["admin1@example.com", "admin2@example.com", "admin3@example.com"];

        // Assign the ticket to a random admin
        const assignedTo = admins[Math.floor(Math.random() * admins.length)];

        // Generate a custom auto-incremental ticket ID
        const ticketId = await generateTicketId();

        // Create a new ticket
        const newTicket = await Ticket.create({
            id: await generateCustomId(),
            ticketId,
            status: "pending",
            title,
            ticketMadeBy,
            description,
            assignedTo,
        });

        return res.status(201).json({
            message: "Ticket created successfully!",
            data: newTicket,
        });
    } catch (error) {
        next(error);
    }
};
















// Getting tickets accordig to client id.
const getTicketsByUser = async (req, res, next) => {
    try {
        const { ticketMadeBy } = req.params; // Assuming ticketMadeBy is passed as a URL parameter

        // Find all tickets made by the specified user
        const tickets = await Ticket.findAll({ where: { ticketMadeBy } });

        if (tickets.length === 0) {
            return res.status(404).json({
                message: "No tickets found for the specified user.",
            });
        }

        return res.status(200).json({
            message: "Tickets retrieved successfully!",
            data: tickets,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { createTicket,getTicketsByUser };
