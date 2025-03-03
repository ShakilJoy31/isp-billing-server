const express = require("express");
const { addMessage, getMessages, updateMessage, deleteMessage, addContactMessage, getContactMessage, deleteContactMessage, upsertHospitalContactInfo, getHospitalContactInfo } = require("../controller/inbox/inbox");
const router = express.Router();

router.post("/upload-inquery", addMessage);
router.get("/get-inquery", getMessages);
router.put("/update-inquery/:id", updateMessage);
router.delete("/delete-inquery/:id", deleteMessage);


router.post("/upload-message", addContactMessage);
router.get("/get-message", getContactMessage);
router.delete("/delete-message/:id", deleteContactMessage);


// Contact add ang get.
router.post("/upload-contact-information", upsertHospitalContactInfo);
router.get("/get-contact-information", getHospitalContactInfo );

module.exports = inqueriesRoute = router;