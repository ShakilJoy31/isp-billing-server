const express = require("express");
const { createSalary, getAllSalaries, getSalarySummary, getSalariesByEmployee, getSalaryById, updateSalary, deleteSalary } = require("../controller/salary/salary.controller");
const { createEmployeeSalary, getEmployeeAllSalaries, getEmployeeSalaryById, getSalaryByEmployeeId, updateEmployeeSalary, deleteEmployeeSalary, getSalaryStatistics, updatePaymentStatus, bulkUpdatePaymentStatus, generateSalarySlip } = require("../controller/salary/employeeSalary.controller");

const router = express.Router();


//! Salary routes
router.post("/create-salary", createSalary);
router.get("/get-all-salary", getAllSalaries);
router.get("/salary-summary", getSalarySummary);
router.get("/employee/:employeeId", getSalariesByEmployee);
router.get("/get-salary/:id", getSalaryById);
router.put("/update-salary/:id", updateSalary);
router.delete("/delete-salary/:id", deleteSalary);






router.post("/create-employee-salary", createEmployeeSalary);
router.get("/get-all-employee-salaries", getEmployeeAllSalaries);
router.get("/get-employee-salary/:id", getEmployeeSalaryById);
router.get("/get-salary-by-employee/:employeeId", getSalaryByEmployeeId);
router.put("/update-employee-salary/:id", updateEmployeeSalary);
router.delete("/delete-salary/:id", deleteEmployeeSalary);
router.get("/employee-salary-statistics", getSalaryStatistics);
router.put("/update-employee-payment-status/:id", updatePaymentStatus);
router.put("/employee-bulk-update-payment-status", bulkUpdatePaymentStatus);
router.get("/generate-employee-salary-slip/:id", generateSalarySlip);


module.exports = salaryRoutes = router;