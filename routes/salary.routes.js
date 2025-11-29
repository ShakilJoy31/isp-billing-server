const express = require("express");
const { createSalary, getAllSalaries, getSalarySummary, getSalariesByEmployee, getSalaryById, updateSalary, deleteSalary } = require("../controller/salary/salary.controller");

const router = express.Router();


//! Salary routes
router.post("/create-salary", createSalary);
router.get("/get-all-salary", getAllSalaries);
router.get("/salary-summary", getSalarySummary);
router.get("/employee/:employeeId", getSalariesByEmployee);
router.get("/get-salary/:id", getSalaryById);
router.put("/update-salary/:id", updateSalary);
router.delete("/delete-salary/:id", deleteSalary);


module.exports = salaryRoutes = router;