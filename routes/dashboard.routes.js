const express = require("express");
const { getDoctorDashboardData, getSuperAdminDashboardData } = require("../controller/adminDashboardController");

const router = express.Router();
router.get("/get-doctor-dashboard-data", getDoctorDashboardData);
router.get("/get-superadmin-dashboard-data", getSuperAdminDashboardData); 

module.exports = adminDashboardRoute = router;
