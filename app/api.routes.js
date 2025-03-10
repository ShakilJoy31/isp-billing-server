const authenticationRoutes = require("../routes/authentication.routes");
const paymentRoutes = require("../routes/payment.routes");
const ticketRoutes = require("../routes/ticket")

const router = require("express").Router();

router.use("/authentication", authenticationRoutes);

router.use("/ticket", ticketRoutes);

router.use("/payment", paymentRoutes);

module.exports = router;