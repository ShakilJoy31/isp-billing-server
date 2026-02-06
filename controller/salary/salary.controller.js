const AuthorityInformation = require("../../models/Authentication/authority.model");
const Salary = require("../../models/salary/salary.model");
const { sendSMSHelper } = require("../../utils/helper/sendSMS");

// Create new salary record
const createSalary = async (req, res, next) => {
  try {
    const {
      employeeId,
      employeeName,
      department,
      designation,
      salaryMonth,
      salaryYear,
      basicSalary,
      houseRent,
      medicalAllowance,
      travelAllowance,
      otherAllowances,
      providentFund,
      taxDeduction,
      otherDeductions,
      totalWorkingDays,
      presentDays,
      absentDays,
      paidLeaves,
      unpaidLeaves,
      overtimeHours,
      overtimeRate,
      overtimeAmount,
      performanceBonus,
      festivalBonus,
      otherBonuses,
      paymentStatus,
      paymentDate,
      paymentMethod,
      bankAccount,
      note,
    } = req.body;

    // Validate required fields
    if (
      !employeeId ||
      !employeeName ||
      !department ||
      !designation ||
      !salaryMonth ||
      !salaryYear
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: employeeId, employeeName, department, designation, salaryMonth, salaryYear",
      });
    }

    // Check if salary already exists for this employee and month
    const existingSalary = await Salary.findOne({
      where: {
        employeeId,
        salaryMonth,
        salaryYear,
      },
    });

    if (existingSalary) {
      return res.status(400).json({
        message:
          "Salary record already exists for this employee for the specified month",
      });
    }

    // Create new salary record
    const newSalary = await Salary.create({
      employeeId,
      employeeName,
      department,
      designation,
      salaryMonth,
      salaryYear,
      basicSalary: basicSalary || 0,
      houseRent: houseRent || 0,
      medicalAllowance: medicalAllowance || 0,
      travelAllowance: travelAllowance || 0,
      otherAllowances: otherAllowances || 0,
      providentFund: providentFund || 0,
      taxDeduction: taxDeduction || 0,
      otherDeductions: otherDeductions || 0,
      totalWorkingDays: totalWorkingDays || 0,
      presentDays: presentDays || 0,
      absentDays: absentDays || 0,
      paidLeaves: paidLeaves || 0,
      unpaidLeaves: unpaidLeaves || 0,
      overtimeHours: overtimeHours || 0,
      overtimeRate: overtimeRate || 0,
      overtimeAmount: overtimeAmount || 0,
      performanceBonus: performanceBonus || 0,
      festivalBonus: festivalBonus || 0,
      otherBonuses: otherBonuses || 0,
      paymentStatus: paymentStatus || "pending",
      paymentDate,
      paymentMethod,
      bankAccount,
      createdBy: req.user?.id || "admin", // Assuming you have user info in req.user
      note,
    });

    if (paymentStatus === "paid") {
      const employee = await AuthorityInformation.findOne({
        where: { userId: employeeId },
      });
      const result = await sendSMSHelper("Salary receive", employee.mobileNo);
      const adminCopySms = await sendSMSHelper("Salary receive", '+8801684175551');
    }

    return res.status(201).json({
      message: "Salary record created successfully!",
      salary: newSalary,
    });
  } catch (error) {
    console.error("Error creating salary:", error);
    next(error);
  }
};

// Get all salary records with optional filtering
const getAllSalaries = async (req, res, next) => {
  try {
    const {
      month,
      year,
      department,
      paymentStatus,
      employeeId,
      page = 1,
      limit = 10,
    } = req.query;

    // Build where clause for filtering
    const whereClause = {};

    if (month) whereClause.salaryMonth = month;
    if (year) whereClause.salaryYear = parseInt(year);
    if (department) whereClause.department = department;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;
    if (employeeId) whereClause.employeeId = employeeId;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const salaries = await Salary.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    return res.status(200).json({
      message: "Salaries retrieved successfully!",
      salaries: salaries.rows,
      totalCount: salaries.count,
      totalPages: Math.ceil(salaries.count / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error retrieving salaries:", error);
    next(error);
  }
};

// Get salary by ID
const getSalaryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid salary ID" });
    }

    const salary = await Salary.findOne({ where: { id } });

    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    return res.status(200).json({
      message: "Salary retrieved successfully!",
      salary,
    });
  } catch (error) {
    console.error("Error retrieving salary:", error);
    next(error);
  }
};

// Get salaries by employee ID
const getSalariesByEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const salaries = await Salary.findAndCountAll({
      where: { employeeId },
      order: [
        ["salaryYear", "DESC"],
        ["salaryMonth", "DESC"],
      ],
      limit: parseInt(limit),
      offset: offset,
    });

    return res.status(200).json({
      message: "Employee salaries retrieved successfully!",
      salaries: salaries.rows,
      totalCount: salaries.count,
      totalPages: Math.ceil(salaries.count / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error retrieving employee salaries:", error);
    next(error);
  }
};

//! Update salary record
const updateSalary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(updateData);
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid salary ID" });
    }

    // Find the salary record
    const salary = await Salary.findOne({ where: { id } });

    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    // Remove id and salaryId from update data to prevent modification
    delete updateData.id;
    delete updateData.salaryId;

    // Update the salary record
    await salary.update(updateData);

    if (updateData.paymentStatus === "paid") {
      const employee = await AuthorityInformation.findOne({
        where: { userId: updateData.employee },
      });
      const result = await sendSMSHelper("Salary receive", employee.mobileNo);
      const adminCopySms = await sendSMSHelper("Salary receive", '+8801684175551');
    }

    return res.status(200).json({
      message: "Salary record updated successfully!",
      salary,
    });
  } catch (error) {
    console.error("Error updating salary:", error);
    next(error);
  }
};

// Delete salary record
const deleteSalary = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid salary ID" });
    }

    const salary = await Salary.findOne({ where: { id } });

    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    await salary.destroy();

    return res.status(200).json({
      message: "Salary record deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting salary:", error);
    next(error);
  }
};

// Get salary summary (for dashboard)
const getSalarySummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const whereClause = {};
    if (month) whereClause.salaryMonth = month;
    if (year) whereClause.salaryYear = parseInt(year);

    const salaries = await Salary.findAll({
      where: whereClause,
      attributes: [
        "paymentStatus",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("netSalary")), "totalAmount"],
      ],
      group: ["paymentStatus"],
    });

    const totalEmployees = await Salary.count({ where: whereClause });
    const totalPaid = await Salary.sum("netSalary", {
      where: { ...whereClause, paymentStatus: "paid" },
    });

    return res.status(200).json({
      message: "Salary summary retrieved successfully!",
      summary: {
        totalEmployees,
        totalPaid: totalPaid || 0,
        statusBreakdown: salaries,
      },
    });
  } catch (error) {
    console.error("Error retrieving salary summary:", error);
    next(error);
  }
};

module.exports = {
  createSalary,
  getAllSalaries,
  getSalaryById,
  getSalariesByEmployee,
  updateSalary,
  deleteSalary,
  getSalarySummary,
};
