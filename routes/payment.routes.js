const express = require("express");
const { createTransaction, getTransactionsByUserId } = require("../controller/payment/payment");
const router = express.Router();

router.post("/add-new-payment", createTransaction);
router.get("/payment-history/:userId", getTransactionsByUserId);



module.exports = paymentRoutes = router;