const express = require("express");
const { createMultipleEmployeeAttendance, getAllEmployeeAttendance, getEmployeeAttendanceById, getAttendanceByEmployee, updateEmployeeAttendance, deleteEmployeeAttendance, getAttendanceSummary } = require("../controller/attendence/attendence.controller");


const router = express.Router();


router.post("/create-multiple-employee-attendance", createMultipleEmployeeAttendance);
router.get("/get-all-employee-attendance", getAllEmployeeAttendance);
router.get("/get-employee-attendance/:id", getEmployeeAttendanceById);
router.get("/employee/:employeeId/attendance", getAttendanceByEmployee);
router.put("/update-employee-attendance/:id", updateEmployeeAttendance);
router.delete("/delete-employee-attendance/:id", deleteEmployeeAttendance);
router.get("/attendance-summary", getAttendanceSummary);

module.exports = attendanceRoutes = router;