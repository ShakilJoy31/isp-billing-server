const express = require("express");
const { addClientFeedback, getClientFeedback, updateClientFeedback, deleteClientFeedback } = require("../controller/client-feedback/client");
const router = express.Router();

router.post("/upload-client-feedback", addClientFeedback);
router.get("/get-client-feedback", getClientFeedback);
router.put("/update-client-feedback/:id", updateClientFeedback);
router.delete("/delete-client-feedback/:id", deleteClientFeedback);

module.exports = clientRoutes = router;