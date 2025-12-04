const express = require("express");
const { createReminder, createBulkReminders, getAllReminders, getReminderById, updateReminder, deleteReminder, sendReminder, cancelReminder, getReminderStats, getUserWarningStatus } = require("../controller/reminder/reminder.controller");


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

module.exports = reminderRoutes = router;