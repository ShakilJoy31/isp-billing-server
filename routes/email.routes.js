// In your existing email.routes.js file
const express = require("express");
const { 
  sendAccountCreationEmail,
  sendSalaryReceivedEmail,
  sendReminderEmail,
  sendBillCollectionEmail,
  sendTransactionStatusEmail,
} = require("../controller/email/email.controller");
const { createEmail, getAllEmails, getEmailById, updateEmail, toggleEmailStatus, deleteEmail, getActiveEmails, getEmailStats } = require("../controller/email/emailManagement.controller");
const { createSMS, getAllSMS, getSMSById, updateSMS, deleteSMS, testSMS } = require("../controller/email/smsManagement.controller");
const router = express.Router();

//! Send account creation/welcome email to new client
router.post("/send-account-creation-email/:email", sendAccountCreationEmail);

//! Send salary received email to employee
router.post("/send-salary-email/:employeeId", sendSalaryReceivedEmail);

//! ONE endpoint for all reminder/warning emails
router.post("/send-reminder-email", sendReminderEmail);

//! Bill collection by employee. Super-Admin can collect bill on behalf of a selected employee. 
router.post("/send-bill-collection-email", sendBillCollectionEmail);

//! Approve email by Super-Admin
router.post('/send-transaction-status-email', sendTransactionStatusEmail);



//! Email configuration.........................
// Email Routes
router.post("/add-new-email", createEmail);
router.get("/get-emails", getAllEmails);
router.get("/get-email/:id", getEmailById);
router.put("/update-email/:id", updateEmail);
router.put("/toggle-status/:id", toggleEmailStatus);
router.delete("/delete-email/:id", deleteEmail);
router.get("/stats", getEmailStats);











//! SMS configuration routes....................
router.post("/add-new-sms", createSMS);
router.get("/get-sms", getAllSMS);
router.get("/get-sms/:id", getSMSById);
router.put("/update-sms/:id", updateSMS);
router.delete("/delete-sms/:id", deleteSMS);
router.post("/test-sms/:id", testSMS);


module.exports = router;
