const areaRoutes = require("../routes/area.routes");
const authenticationRoutes = require("../routes/authentication.routes");
const packageRoutes = require("../routes/package.routes");
const paymentRoutes = require("../routes/payment.routes");
const salaryRoutes = require("../routes/salary.routes");
const ticketRoutes = require("../routes/ticket")

const router = require("express").Router();

router.use("/authentication", authenticationRoutes);

router.use("/ticket", ticketRoutes);

router.use("/payment", paymentRoutes);

router.use("/package", packageRoutes)

router.use("/area", areaRoutes)

router.use("/salary", salaryRoutes);

module.exports = router;