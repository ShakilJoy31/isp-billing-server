const express = require("express");
const { addMessage, getMessages, updateMessage, deleteMessage } = require("../controller/inbox/inbox");
const { addAppointment, getAppointments, updateAppointment, deleteAppointment, getAppointmentsAccordingToDoctor } = require("../controller/appointment/appointmentController");
const router = express.Router();

router.post("/add-appointment", addAppointment);


router.get("/get-appointment", getAppointments);
router.get("/get-appointment-for-doctor/:id", getAppointmentsAccordingToDoctor);
router.put("/update-appointment/:id", updateAppointment);
router.delete("/delete-appointment/:id", deleteAppointment);

module.exports = appointmentRoute = router;