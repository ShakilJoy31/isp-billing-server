const router = require("express").Router();

const uploadRoutes = require("../routes/upload.routes");
const serviceRoutes = require("../routes/doctor.routes");
const authenticationRoutes = require("../routes/authentication.routes");
const inqueriesRoute = require("../routes/inquery.routes");
const appointmentRoutes = require("../routes/appointment.routes");
const hospitalRoutes = require("../routes/hospital.route");
const forPatientsRoutes = require("../routes/forPatients.routes");
const adminDashboardRoute = require("../routes/dashboard.routes");
const settingsRoutes = require("../routes/settings.routes");

// Doctor
router.use("/doctor", serviceRoutes);

// Authentication
router.use("/authentication", authenticationRoutes);

router.use("/inquery", inqueriesRoute)

router.use("/appointment", appointmentRoutes)

// About hospital
router.use("/hospital", hospitalRoutes);

// For patients
router.use("/for-patients", forPatientsRoutes);


// For dashboard data
router.use("/admin-dashboard", adminDashboardRoute);


// Route for uploading image. 
router.use("/upload", uploadRoutes);

router.use("/settings", settingsRoutes)

module.exports = router;