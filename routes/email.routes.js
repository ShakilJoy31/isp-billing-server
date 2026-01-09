// In your existing email.routes.js file
const express = require("express");
const { 
  sendAccountCreationEmail,
  sendSalaryReceivedEmail,
  sendReminderEmail,
} = require("../controller/email/email.controller");
const router = express.Router();

//! Send account creation/welcome email to new client
router.post("/send-account-creation-email/:email", sendAccountCreationEmail);

//! Send salary received email to employee
router.post("/send-salary-email/:employeeId", sendSalaryReceivedEmail);

//! ONE endpoint for all reminder/warning emails
router.post("/send-reminder-email", sendReminderEmail);

module.exports = router;
