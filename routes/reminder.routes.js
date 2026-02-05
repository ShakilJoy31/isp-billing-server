const express = require("express");
const { createReminder, createBulkReminders, getAllReminders, getReminderById, updateReminder, deleteReminder, sendReminder, cancelReminder, getReminderStats, getUserWarningStatus } = require("../controller/reminder/reminder.controller");
const { createPublicContact, getAllPublicContacts, getPublicContactById, updatePublicContact, deletePublicContact, bulkDeletePublicContacts, getPublicContactStats } = require("../controller/reminder/publicContact.controller");


const router = express.Router();

// Reminder routes
router.post("/create-reminder", createReminder);
router.post("/create-bulk-reminders", createBulkReminders);
router.get("/get-all-reminders", getAllReminders);
router.get("/get-reminder/:id", getReminderById);
router.put("/update-reminder/:id", updateReminder);
router.delete("/delete-reminder/:id", deleteReminder);
router.get('/user-warning', getUserWarningStatus);



router.post("/send-reminder/:id", sendReminder);
router.post("/cancel-reminder/:id", cancelReminder);

router.get("/reminder-stats", getReminderStats);










//! public contact routes
router.post("/create-contact", createPublicContact);
router.get("/get-all-contacts", getAllPublicContacts);
router.get("/get-contact/:id", getPublicContactById);
router.put("/update-contact/:id", updatePublicContact);
router.delete("/delete-contact/:id", deletePublicContact);
router.post("/bulk-delete-contacts", bulkDeletePublicContacts);
router.get("/contact-stats", getPublicContactStats);

module.exports = reminderRoutes = router;