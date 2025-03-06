const express = require("express");
const { createClient, checkUserCredentials } = require("../controller/auth/signup");
const { createTicket, getTicketsByUser } = require("../controller/ticket/ticket");
const router = express.Router();

router.post("/register-new-ticket", createTicket);

router.get("/get-ticket-accordingTo-client/:ticketMadeBy", getTicketsByUser);

router.post("/login", checkUserCredentials);


module.exports = ticketRoutes = router;