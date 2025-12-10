// routes/contact.routes.js
const express = require("express");
const { createContact, getAllContacts, getActiveContacts, getContactById, updateContact, deleteContact, toggleContactStatus, seedInitialContacts } = require("../controller/live-chat/public-contact.controller");
const router = express.Router();

// Contact CRUD routes
router.post("/create", createContact);
router.get("/all", getAllContacts);              // Admin panel
router.get("/active", getActiveContacts);        // Frontend - single endpoint
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);
router.patch("/:id/toggle-status", toggleContactStatus);
router.post("/seed-initial", seedInitialContacts); // One-time setup

module.exports = publicContactRouter = router;