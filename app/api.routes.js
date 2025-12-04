const areaRoutes = require("../routes/area.routes");
const authenticationRoutes = require("../routes/authentication.routes");
const packageRoutes = require("../routes/package.routes");
const paymentRoutes = require("../routes/payment.routes");
const salaryRoutes = require("../routes/salary.routes");
const ticketRoutes = require("../routes/ticket")
const attendanceRoutes = require("../routes/attendence.routes");
const benefitRoutes = require("../routes/benefit.routes");
const reminderRoutes = require("../routes/reminder.routes");
const liveChatRoutes = require("../routes/liveChat.routes");
const uploadWithMulter = require("../middleware/uploadWithMulter");

const router = require("express").Router();

router.use("/authentication", authenticationRoutes);

router.use("/ticket", ticketRoutes);

router.use("/payment", paymentRoutes);

router.use("/package", packageRoutes)

router.use("/area", areaRoutes)

router.use("/salary", salaryRoutes);

router.use("/attendance", attendanceRoutes);

router.use("/benefit", benefitRoutes);

router.use("/reminder", reminderRoutes);

router.use("/live-chat", liveChatRoutes)


router.post("/single", uploadWithMulter.single("file"), (req, res) => {
  res.status(201).json({ url: req.filelink });
});




module.exports = router;