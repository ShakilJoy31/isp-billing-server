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
const publicContactRouter = require("../routes/public-contact.routes");
const bankRoutes = require("../routes/account.routes");
const uploadWithMulter = require("../middleware/uploadWithMulter");
const expenseRoutes = require("../routes/expense.routes");
const FTPServerRoutes = require("../routes/FTPServer.routes");
const emailRoutes = require("../routes/email.routes");

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

router.use("/accounts", bankRoutes);

router.use("/expense", expenseRoutes);

router.use("/live-chat", liveChatRoutes);

router.use("/public-contact", publicContactRouter);

router.use("/ftp", FTPServerRoutes);

router.use("/email", emailRoutes);


router.post("/upload/single", uploadWithMulter.single("file"), (req, res) => {
  // Make sure req.filelink exists
  if (!req.filelink) {
    return res.status(400).json({ message: "File upload failed" });
  }
  
  res.status(201).json({ 
    message: "File uploaded successfully",
    data: { 
      url: req.filelink,
      filename: req.file.filename 
    }
  });
});

// Optional: Add employee-specific photo upload
router.post("/upload/employee-photo", uploadWithMulter.single("photo"), (req, res) => {
  if (!req.filelink) {
    return res.status(400).json({ message: "Photo upload failed" });
  }
  
  res.status(201).json({
    message: "Employee photo uploaded successfully",
    data: {
      photoUrl: req.filelink,
      filename: req.file.filename
    }
  });
});



module.exports = router;