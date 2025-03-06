const authenticationRoutes = require("../routes/authentication.routes");
const ticketRoutes = require("../routes/ticket")

const router = require("express").Router();

router.use("/authentication", authenticationRoutes);

router.use("/ticket", ticketRoutes);

module.exports = router;