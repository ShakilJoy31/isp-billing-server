const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const Salary = require("../../models/salary/employeeSalary.model");
const AuthorityInformation = require("../../models/Authentication/authority.model");


//! Helper function to generate salary ID
const generateSalaryId = async () => {
  const prefix = `SAL`;
  
  // Find the last salary with this prefix
  const lastSalary = await Salary.findOne({
    where: {
      salaryId: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['salaryId', 'DESC']]
  });

  let sequence = 1;
  if (lastSalary && lastSalary.salaryId) {
    const lastSequence = parseInt(lastSalary.salaryId.replace(prefix, ''));
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${sequence.toString().padStart(6, '0')}`;
};

//! Create Salary
const createEmployeeSalary = async (req, res, next) => {
  try {
    const {
      employeeId,
      employeeName,
      department,
      designation,
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
      grossSalary,
      totalDeductions,
      netSalary,
      paymentStatus = "pending",
      paymentDate,
      paymentMethod = "bank",
      bankAccount,
      note,
    } = req.body;

    // Validate required fields
    if (!employeeId || !employeeName) {
      return res.status(400).json({
        message: "Employee ID & Employee Name are required!",
      });
    }

    // Validate basic salary is provided
    if (!basicSalary && basicSalary !== 0) {
      return res.status(400).json({
        message: "Basic salary is required!",
      });
    }

    // Check if employee exists
    const employee = await AuthorityInformation.findOne({
      where: { userId: employeeId }
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }

    // Check if salary already exists for this employee
    const existingSalary = await Salary.findOne({
      where: {
        employeeId,
      }
    });

    if (existingSalary) {
      return res.status(409).json({
        message: "Salary for this employee already exists! Use update instead.",
      });
    }

    // Generate salary ID
    const salaryId = await generateSalaryId();

    // Create salary record
    const newSalary = await Salary.create({
      employeeId,
      employeeName,
      department,
      designation,
      basicSalary: parseFloat(basicSalary) || 0,
      houseRent: parseFloat(houseRent) || 0,
      medicalAllowance: parseFloat(medicalAllowance) || 0,
      travelAllowance: parseFloat(travelAllowance) || 0,
      otherAllowances: parseFloat(otherAllowances) || 0,
      providentFund: parseFloat(providentFund) || 0,
      taxDeduction: parseFloat(taxDeduction) || 0,
      otherDeductions: parseFloat(otherDeductions) || 0,
      totalWorkingDays: parseInt(totalWorkingDays) || 26,
      presentDays: parseFloat(presentDays) || 0,
      absentDays: parseInt(absentDays) || 0,
      paidLeaves: parseInt(paidLeaves) || 0,
      unpaidLeaves: parseInt(unpaidLeaves) || 0,
      overtimeHours: parseFloat(overtimeHours) || 0,
      overtimeRate: parseFloat(overtimeRate) || 200,
      overtimeAmount: parseFloat(overtimeAmount) || 0,
      performanceBonus: parseFloat(performanceBonus) || 0,
      festivalBonus: parseFloat(festivalBonus) || 0,
      otherBonuses: parseFloat(otherBonuses) || 0,
      grossSalary: parseFloat(grossSalary) || 0,
      totalDeductions: parseFloat(totalDeductions) || 0,
      netSalary: parseFloat(netSalary) || 0,
      paymentStatus,
      paymentDate: paymentDate || null,
      paymentMethod,
      bankAccount: bankAccount || "",
      salaryId,
      note: note || "",
    });

    return res.status(201).json({
      message: "Salary created successfully!",
      data: newSalary,
    });
  } catch (error) {
    console.error("Error creating salary:", error);
    next(error);
  }
};

//! Get All Salaries with Filters and Pagination
const getEmployeeAllSalaries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      employeeId = "",
      paymentStatus = "",
      department = "",
      designation = "",
    } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereConditions = {};

    // Search filter
    if (search) {
      whereConditions[Op.or] = [
        { employeeName: { [Op.like]: `%${search}%` } },
        { employeeId: { [Op.like]: `%${search}%` } },
        { salaryId: { [Op.like]: `%${search}%` } },
        { department: { [Op.like]: `%${search}%` } },
        { designation: { [Op.like]: `%${search}%` } },
      ];
    }

    // Employee ID filter
    if (employeeId) {
      whereConditions.employeeId = employeeId;
    }

    // Payment Status filter
    if (paymentStatus) {
      whereConditions.paymentStatus = paymentStatus;
    }

    // Department filter
    if (department) {
      whereConditions.department = department;
    }

    // Designation filter
    if (designation) {
      whereConditions.designation = designation;
    }

    // Fetch salaries with pagination
    const { count, rows: salaries } = await Salary.findAndCountAll({
      where: whereConditions,
      limit: limitNumber,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    // Calculate totals for the current query
    const totals = await Salary.findAll({
      where: whereConditions,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalCount'],
        [sequelize.fn('SUM', sequelize.col('grossSalary')), 'totalGrossSalary'],
        [sequelize.fn('SUM', sequelize.col('netSalary')), 'totalNetSalary'],
        [sequelize.fn('SUM', sequelize.col('totalDeductions')), 'totalDeductions'],
      ],
      raw: true,
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Salaries retrieved successfully!",
      data: salaries,
      totals: totals[0] || {
        totalCount: 0,
        totalGrossSalary: 0,
        totalNetSalary: 0,
        totalDeductions: 0,
      },
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error getting all salaries:", error);
    next(error);
  }
};

//! Get Salary by ID
const getEmployeeSalaryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findByPk(id);

    if (!salary) {
      return res.status(404).json({
        message: "Salary record not found!",
      });
    }

    return res.status(200).json({
      message: "Salary retrieved successfully!",
      data: salary,
    });
  } catch (error) {
    console.error("Error getting salary by ID:", error);
    next(error);
  }
};

//! Get Salary by Employee ID
const getSalaryByEmployeeId = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const salary = await Salary.findOne({
      where: { employeeId },
    });

    if (!salary) {
      return res.status(404).json({
        message: "Salary record not found for this employee!",
        data: null
      });
    }

    return res.status(200).json({
      message: "Employee salary retrieved successfully!",
      data: salary,
    });
  } catch (error) {
    console.error("Error getting salary by employee ID:", error);
    next(error);
  }
};

// const getSalaryByEmployeeId = async (req, res, next) => {
//   try {
//     const { employeeId } = req.params;

//     console.log(employeeId)

//     const whereConditions = {employeeId };

//     const salaries = await Salary.findOne({
//       where: whereConditions,
//     });

//     console.log(salaries)

//     return res.status(200).json({
//       message: "Employee salaries retrieved successfully!",
//       data: salaries,
//     });
//   } catch (error) {
//     console.error("Error getting salary by employee ID:", error);
//     next(error);
//   }
// };

//! Update Salary
const updateEmployeeSalary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
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
      grossSalary,
      totalDeductions,
      netSalary,
      paymentStatus,
      paymentDate,
      paymentMethod,
      bankAccount,
      note,
    } = req.body;

    // Find the salary record
    const salary = await Salary.findByPk(id);

    if (!salary) {
      return res.status(404).json({
        message: "Salary record not found!",
      });
    }

    // Prepare update data
    const updateData = {
      basicSalary: basicSalary !== undefined ? parseFloat(basicSalary) : salary.basicSalary,
      houseRent: houseRent !== undefined ? parseFloat(houseRent) : salary.houseRent,
      medicalAllowance: medicalAllowance !== undefined ? parseFloat(medicalAllowance) : salary.medicalAllowance,
      travelAllowance: travelAllowance !== undefined ? parseFloat(travelAllowance) : salary.travelAllowance,
      otherAllowances: otherAllowances !== undefined ? parseFloat(otherAllowances) : salary.otherAllowances,
      providentFund: providentFund !== undefined ? parseFloat(providentFund) : salary.providentFund,
      taxDeduction: taxDeduction !== undefined ? parseFloat(taxDeduction) : salary.taxDeduction,
      otherDeductions: otherDeductions !== undefined ? parseFloat(otherDeductions) : salary.otherDeductions,
      totalWorkingDays: totalWorkingDays !== undefined ? parseInt(totalWorkingDays) : salary.totalWorkingDays,
      presentDays: presentDays !== undefined ? parseFloat(presentDays) : salary.presentDays,
      absentDays: absentDays !== undefined ? parseInt(absentDays) : salary.absentDays,
      paidLeaves: paidLeaves !== undefined ? parseInt(paidLeaves) : salary.paidLeaves,
      unpaidLeaves: unpaidLeaves !== undefined ? parseInt(unpaidLeaves) : salary.unpaidLeaves,
      overtimeHours: overtimeHours !== undefined ? parseFloat(overtimeHours) : salary.overtimeHours,
      overtimeRate: overtimeRate !== undefined ? parseFloat(overtimeRate) : salary.overtimeRate,
      overtimeAmount: overtimeAmount !== undefined ? parseFloat(overtimeAmount) : salary.overtimeAmount,
      performanceBonus: performanceBonus !== undefined ? parseFloat(performanceBonus) : salary.performanceBonus,
      festivalBonus: festivalBonus !== undefined ? parseFloat(festivalBonus) : salary.festivalBonus,
      otherBonuses: otherBonuses !== undefined ? parseFloat(otherBonuses) : salary.otherBonuses,
      grossSalary: grossSalary !== undefined ? parseFloat(grossSalary) : salary.grossSalary,
      totalDeductions: totalDeductions !== undefined ? parseFloat(totalDeductions) : salary.totalDeductions,
      netSalary: netSalary !== undefined ? parseFloat(netSalary) : salary.netSalary,
      paymentStatus: paymentStatus !== undefined ? paymentStatus : salary.paymentStatus,
      paymentDate: paymentDate !== undefined ? paymentDate : salary.paymentDate,
      paymentMethod: paymentMethod !== undefined ? paymentMethod : salary.paymentMethod,
      bankAccount: bankAccount !== undefined ? bankAccount : salary.bankAccount,
      note: note !== undefined ? note : salary.note,
    };

    // Update the salary
    await Salary.update(updateData, {
      where: { id },
    });

    // Fetch the updated salary
    const updatedSalary = await Salary.findByPk(id);

    return res.status(200).json({
      message: "Salary updated successfully!",
      data: updatedSalary,
    });
  } catch (error) {
    console.error("Error updating salary:", error);
    next(error);
  }
};

//! Delete Salary
const deleteEmployeeSalary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findByPk(id);

    if (!salary) {
      return res.status(404).json({
        message: "Salary record not found!",
      });
    }

    await Salary.destroy({
      where: { id },
    });

    return res.status(200).json({
      message: "Salary deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting salary:", error);
    next(error);
  }
};

//! Get Salary Statistics
const getSalaryStatistics = async (req, res, next) => {
  try {
    // Get statistics
    const statistics = await Salary.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalSalaries'],
        [sequelize.fn('SUM', sequelize.col('grossSalary')), 'totalGrossSalary'],
        [sequelize.fn('SUM', sequelize.col('netSalary')), 'totalNetSalary'],
        [sequelize.fn('SUM', sequelize.col('totalDeductions')), 'totalDeductions'],
        [sequelize.fn('AVG', sequelize.col('netSalary')), 'averageSalary'],
      ],
      raw: true,
    });

    // Get payment status breakdown
    const paymentStats = await Salary.findAll({
      attributes: [
        'paymentStatus',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('netSalary')), 'totalAmount'],
      ],
      group: ['paymentStatus'],
      raw: true,
    });

    // Get department-wise breakdown
    const departmentStats = await Salary.findAll({
      attributes: [
        'department',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('netSalary')), 'totalSalary'],
      ],
      group: ['department'],
      order: [[sequelize.fn('SUM', sequelize.col('netSalary')), 'DESC']],
      raw: true,
    });

    return res.status(200).json({
      message: "Salary statistics retrieved successfully!",
      data: {
        overview: statistics[0] || {
          totalSalaries: 0,
          totalGrossSalary: 0,
          totalNetSalary: 0,
          totalDeductions: 0,
          averageSalary: 0,
        },
        paymentStatusBreakdown: paymentStats,
        departmentBreakdown: departmentStats,
      },
    });
  } catch (error) {
    console.error("Error getting salary statistics:", error);
    next(error);
  }
};

//! Update Payment Status
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentDate, paymentMethod, bankAccount } = req.body;

    const salary = await Salary.findByPk(id);

    if (!salary) {
      return res.status(404).json({
        message: "Salary record not found!",
      });
    }

    const updateData = {
      paymentStatus: paymentStatus || salary.paymentStatus,
      paymentDate: paymentDate || salary.paymentDate,
      paymentMethod: paymentMethod || salary.paymentMethod,
      bankAccount: bankAccount || salary.bankAccount,
    };

    await Salary.update(updateData, {
      where: { id },
    });

    const updatedSalary = await Salary.findByPk(id);

    return res.status(200).json({
      message: "Payment status updated successfully!",
      data: updatedSalary,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    next(error);
  }
};

//! Bulk Update Payment Status
const bulkUpdatePaymentStatus = async (req, res, next) => {
  try {
    const { salaryIds, paymentStatus, paymentDate, paymentMethod, bankAccount } = req.body;

    if (!Array.isArray(salaryIds) || salaryIds.length === 0) {
      return res.status(400).json({
        message: "Salary IDs are required!",
      });
    }

    if (!paymentStatus) {
      return res.status(400).json({
        message: "Payment status is required!",
      });
    }

    const updateData = {
      paymentStatus,
      paymentDate: paymentDate || null,
      paymentMethod: paymentMethod || 'bank',
      bankAccount: bankAccount || "",
    };

    const [affectedRows] = await Salary.update(updateData, {
      where: {
        id: {
          [Op.in]: salaryIds,
        },
      },
    });

    return res.status(200).json({
      message: `Payment status updated for ${affectedRows} salary record(s)!`,
      affectedRows,
    });
  } catch (error) {
    console.error("Error bulk updating payment status:", error);
    next(error);
  }
};

//! Generate Salary Slip
const generateSalarySlip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findByPk(id);

    if (!salary) {
      return res.status(404).json({
        message: "Salary record not found!",
      });
    }

    // Get employee details
    const employee = await AuthorityInformation.findOne({
      where: { userId: salary.employeeId },
      attributes: [
        'fullName', 'userId', 'email', 'mobileNo', 
        'address', 'photo', 'dateOfBirth', 'bloodGroup',
        'jobCategory', 'jobType'
      ]
    });

    // Calculate days worked percentage
    const daysWorkedPercentage = salary.totalWorkingDays > 0 
      ? ((salary.presentDays + salary.paidLeaves) / salary.totalWorkingDays) * 100 
      : 0;

    // Format salary slip data
    const salarySlip = {
      salaryId: salary.salaryId,
      employee: {
        id: salary.employeeId,
        name: salary.employeeName,
        userId: employee?.userId || salary.employeeId,
        email: employee?.email || '',
        mobileNo: employee?.mobileNo || '',
        department: salary.department,
        designation: salary.designation,
      },
      period: {
        generatedDate: new Date().toISOString().split('T')[0],
      },
      earnings: {
        basicSalary: salary.basicSalary,
        houseRent: salary.houseRent,
        medicalAllowance: salary.medicalAllowance,
        travelAllowance: salary.travelAllowance,
        otherAllowances: salary.otherAllowances,
        overtimeAmount: salary.overtimeAmount,
        performanceBonus: salary.performanceBonus,
        festivalBonus: salary.festivalBonus,
        otherBonuses: salary.otherBonuses,
        total: salary.grossSalary,
      },
      deductions: {
        providentFund: salary.providentFund,
        taxDeduction: salary.taxDeduction,
        otherDeductions: salary.otherDeductions,
        total: salary.totalDeductions,
      },
      attendance: {
        totalWorkingDays: salary.totalWorkingDays,
        presentDays: salary.presentDays,
        absentDays: salary.absentDays,
        paidLeaves: salary.paidLeaves,
        unpaidLeaves: salary.unpaidLeaves,
        daysWorkedPercentage: Math.round(daysWorkedPercentage),
        overtimeHours: salary.overtimeHours,
      },
      summary: {
        grossSalary: salary.grossSalary,
        totalDeductions: salary.totalDeductions,
        netSalary: salary.netSalary,
        paymentStatus: salary.paymentStatus,
        paymentDate: salary.paymentDate,
        paymentMethod: salary.paymentMethod,
        bankAccount: salary.bankAccount,
      },
      note: salary.note,
    };

    return res.status(200).json({
      message: "Salary slip generated successfully!",
      data: salarySlip,
    });
  } catch (error) {
    console.error("Error generating salary slip:", error);
    next(error);
  }
};

// Export all functions
module.exports = {
  createEmployeeSalary,
  getEmployeeAllSalaries,
  getEmployeeSalaryById,
  getSalaryByEmployeeId,
  updateEmployeeSalary,
  deleteEmployeeSalary,
  getSalaryStatistics,
  updatePaymentStatus,
  bulkUpdatePaymentStatus,
  generateSalarySlip,
};