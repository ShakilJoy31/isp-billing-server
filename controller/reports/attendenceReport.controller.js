const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const EmployeeAttendance = require("../../models/attendence/attendence.model");
const Salary = require("../../models/salary/salary.model");


// Helper function to calculate attendance score (if needed)
function calculateAttendanceScore(attendancePercentage, avgWorkingHours, totalLateMinutes) {
  // Implement your scoring logic here
  let score = attendancePercentage * 0.5;
  score += Math.min(avgWorkingHours / 8 * 30, 30); // Max 30 points for working hours
  score -= Math.min(totalLateMinutes / 60 * 10, 20); // Deduct for late minutes
  
  return Math.max(0, Math.min(100, score)).toFixed(2);
}
//! 1. EMPLOYEE ATTENDANCE REPORT
const getEmployeeAttendanceReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      employeeId,
      status,
      department, // This filter might not work since department doesn't exist
      page = 1,
      limit = 30,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = new Date(startDate);
      if (endDate) whereClause.date[Op.lte] = new Date(endDate + " 23:59:59");
    }
    if (employeeId) whereClause.employeeId = employeeId;
    if (status) whereClause.status = status;

    // Get attendance records WITHOUT include (to avoid association issues)
    const { count, rows: attendanceRecords } =
      await EmployeeAttendance.findAndCountAll({
        where: whereClause,
        limit: limitNumber,
        offset: offset,
        order: [["date", "DESC"]],
        // Remove include since association might not work
      });

    // Get employee IDs from attendance records
    const employeeIds = [...new Set(attendanceRecords.map(record => record.employeeId))];

    // Fetch employee information separately
    const employees = await AuthorityInformation.findAll({
      where: { id: employeeIds },
      attributes: ["id", "fullName", "userId", "role", "jobCategory", "jobType"], // Removed department
    });

    // Create employee lookup map
    const employeeMap = {};
    employees.forEach(employee => {
      employeeMap[employee.id] = employee;
    });

    // Combine attendance records with employee data
    const attendanceWithEmployee = attendanceRecords.map(record => {
      const recordObj = record.toJSON();
      const employee = employeeMap[record.employeeId];
      
      recordObj.employee = employee ? {
        fullName: employee.fullName,
        userId: employee.userId,
        role: employee.role,
        jobCategory: employee.jobCategory,
        jobType: employee.jobType
      } : null;

      return recordObj;
    });

    // If department filter is applied, filter after fetching
    let filteredRecords = attendanceWithEmployee;
    if (department) {
      filteredRecords = attendanceWithEmployee.filter(
        (record) =>
          record.employee && record.employee.jobCategory === department, // Use jobCategory instead of department
      );
    }

    // Calculate attendance statistics
    const attendanceStats = await EmployeeAttendance.findAll({
      where: whereClause,
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("AVG", sequelize.col("workingHours")), "avgWorkingHours"],
        [sequelize.fn("SUM", sequelize.col("lateMinutes")), "totalLateMinutes"],
        [sequelize.fn("AVG", sequelize.col("lateMinutes")), "avgLateMinutes"],
      ],
      group: ["status"],
    });

    // Employee-wise attendance summary
    const employeeSummary = await EmployeeAttendance.findAll({
      where: whereClause,
      attributes: [
        "employeeId",
        [sequelize.fn("COUNT", sequelize.col("id")), "totalDays"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(`CASE WHEN status = 'Present' THEN 1 ELSE 0 END`),
          ),
          "presentDays",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(`CASE WHEN status = 'Absent' THEN 1 ELSE 0 END`),
          ),
          "absentDays",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(`CASE WHEN status = 'Leave' THEN 1 ELSE 0 END`),
          ),
          "leaveDays",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              `CASE WHEN status = 'Half Day' THEN 1 ELSE 0 END`,
            ),
          ),
          "halfDays",
        ],
        [
          sequelize.fn("SUM", sequelize.col("workingHours")),
          "totalWorkingHours",
        ],
        [sequelize.fn("AVG", sequelize.col("workingHours")), "avgWorkingHours"],
        [sequelize.fn("SUM", sequelize.col("lateMinutes")), "totalLateMinutes"],
      ],
      group: ["employeeId"],
    });

    // Add employee details to summary using our employeeMap
    const employeeSummaryWithDetails = employeeSummary.map((summary) => {
      const summaryData = summary.toJSON();
      const employee = employeeMap[summaryData.employeeId];

      // Calculate attendance percentage
      const attendancePercentage =
        summaryData.totalDays > 0
          ? ((summaryData.presentDays / summaryData.totalDays) * 100).toFixed(2)
          : 0;

      // Calculate late arrival frequency
      const lateFrequency =
        summaryData.totalDays > 0
          ? summaryData.totalLateMinutes > 0
            ? 1
            : 0 // Simplified - can be enhanced
          : 0;

      return {
        employeeId: summaryData.employeeId,
        employeeName: employee ? employee.fullName : "Unknown",
        userId: employee ? employee.userId : "N/A",
        role: employee ? employee.role : "N/A",
        jobCategory: employee ? employee.jobCategory : "N/A", // Use jobCategory
        jobType: employee ? employee.jobType : "N/A", // Added jobType
        totalDays: summaryData.totalDays,
        presentDays: summaryData.presentDays,
        absentDays: summaryData.absentDays,
        leaveDays: summaryData.leaveDays,
        halfDays: summaryData.halfDays,
        attendancePercentage: parseFloat(attendancePercentage),
        totalWorkingHours: parseFloat(summaryData.totalWorkingHours || 0),
        avgWorkingHours: parseFloat(summaryData.avgWorkingHours || 0),
        totalLateMinutes: summaryData.totalLateMinutes,
        lateFrequency: lateFrequency,
        performanceScore: calculateAttendanceScore(
          parseFloat(attendancePercentage),
          parseFloat(summaryData.avgWorkingHours || 0),
          summaryData.totalLateMinutes,
        ),
      };
    });

    // Daily attendance trend
    const dailyAttendance = await EmployeeAttendance.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("DATE", sequelize.col("date")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalEmployees"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(`CASE WHEN status = 'Present' THEN 1 ELSE 0 END`),
          ),
          "presentCount",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(`CASE WHEN status = 'Absent' THEN 1 ELSE 0 END`),
          ),
          "absentCount",
        ],
        [sequelize.fn("AVG", sequelize.col("workingHours")), "avgWorkingHours"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("date"))],
      order: [[sequelize.fn("DATE", sequelize.col("date")), "DESC"]],
      limit: 30,
    });

    // Late arrival analysis
    const lateAnalysis = await EmployeeAttendance.findAll({
      where: {
        ...whereClause,
        lateMinutes: { [Op.gt]: 0 },
      },
      attributes: [
        "employeeId",
        [sequelize.fn("COUNT", sequelize.col("id")), "lateDays"],
        [sequelize.fn("SUM", sequelize.col("lateMinutes")), "totalLateMinutes"],
        [sequelize.fn("AVG", sequelize.col("lateMinutes")), "avgLateMinutes"],
        [sequelize.fn("MAX", sequelize.col("lateMinutes")), "maxLateMinutes"],
      ],
      group: ["employeeId"],
      order: [[sequelize.fn("SUM", sequelize.col("lateMinutes")), "DESC"]],
    });

    // Add employee details to late analysis
    const lateAnalysisWithDetails = lateAnalysis.map(analysis => {
      const analysisData = analysis.toJSON();
      const employee = employeeMap[analysisData.employeeId];
      
      return {
        ...analysisData,
        employeeName: employee ? employee.fullName : "Unknown",
        userId: employee ? employee.userId : "N/A",
        role: employee ? employee.role : "N/A",
      };
    });

    const totalPages = Math.ceil(count / limitNumber);

    res.status(200).json({
      success: true,
      data: {
        attendanceRecords: filteredRecords,
        statistics: {
          attendanceStats,
          employeeSummary: employeeSummaryWithDetails,
          dailyAttendance,
          lateAnalysis: lateAnalysisWithDetails,
        },
        summary: {
          totalRecords: count,
          totalPresent:
            attendanceStats.find((s) => s.status === "Present")?.count || 0,
          totalAbsent:
            attendanceStats.find((s) => s.status === "Absent")?.count || 0,
          totalLeave:
            attendanceStats.find((s) => s.status === "Leave")?.count || 0,
          avgWorkingHours:
            count > 0
              ? attendanceStats.reduce(
                  (sum, stat) =>
                    sum + parseFloat(stat.avgWorkingHours || 0) * stat.count,
                  0,
                ) / count
              : 0,
          totalLateMinutes: attendanceStats.reduce(
            (sum, stat) => sum + parseInt(stat.totalLateMinutes || 0),
            0,
          ),
        },
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in employee attendance report:", error);
    next(error);
  }
};




//! 2. SALARY & PAYMENT REPORT
const getSalaryPaymentReport = async (req, res, next) => {
  try {
    const {
      salaryMonth,
      salaryYear,
      employeeId,
      paymentStatus,
      department,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (salaryMonth) whereClause.salaryMonth = salaryMonth;
    if (salaryYear) whereClause.salaryYear = salaryYear;
    if (employeeId) whereClause.employeeId = employeeId;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;

    // Get salary records WITHOUT includes
    const { count, rows: salaryRecords } = await Salary.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [
        ["salaryMonth", "DESC"],
        ["salaryYear", "DESC"],
      ],
    });

    // Get unique employee IDs from salary records
    const employeeIds = [...new Set(salaryRecords.map(record => record.employeeId))];

    // Fetch employee information separately
    const employees = await AuthorityInformation.findAll({
      where: { userId: employeeIds },
      attributes: ["userId", "fullName", "jobCategory", "role", "baseSalary"],
    });

    // Create employee lookup map
    const employeeMap = {};
    employees.forEach(employee => {
      employeeMap[employee.userId] = employee;
    });

    // Add employee details to salary records
    const recordsWithEmployee = salaryRecords.map(record => {
      const recordObj = record.toJSON();
      const employee = employeeMap[record.employeeId];
      
      recordObj.employeeDetails = employee ? {
        fullName: employee.fullName,
        department: employee.jobCategory, // Using jobCategory as department
        role: employee.role,
        baseSalary: employee.baseSalary
      } : {
        fullName: record.employeeName,
        department: record.department,
        role: record.designation,
        baseSalary: 0
      };
      
      return recordObj;
    });

    // Apply department filter if specified
    let filteredRecords = recordsWithEmployee;
    if (department) {
      filteredRecords = recordsWithEmployee.filter(
        (record) =>
          record.employeeDetails &&
          record.employeeDetails.department === department,
      );
    }

    // Salary statistics
    const salaryStats = await Salary.findAll({
      where: whereClause,
      attributes: [
        "paymentStatus",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("basicSalary")), "totalBasic"],
        [sequelize.fn("SUM", sequelize.col("houseRent")), "totalHouseRent"],
        [
          sequelize.fn("SUM", sequelize.col("medicalAllowance")),
          "totalMedical",
        ],
        [sequelize.fn("SUM", sequelize.col("travelAllowance")), "totalTravel"],
        [
          sequelize.fn("SUM", sequelize.col("otherAllowances")),
          "totalOtherAllowances",
        ],
        [sequelize.fn("SUM", sequelize.col("overtimeAmount")), "totalOvertime"],
        [sequelize.fn("SUM", sequelize.col("performanceBonus")), "totalBonus"],
        [sequelize.fn("SUM", sequelize.col("providentFund")), "totalPF"],
        [sequelize.fn("SUM", sequelize.col("taxDeduction")), "totalTax"],
      ],
      group: ["paymentStatus"],
    });

    // Calculate net salary for each record
    const recordsWithNetSalary = filteredRecords.map((record) => {
      const earnings =
        (record.basicSalary || 0) +
        (record.houseRent || 0) +
        (record.medicalAllowance || 0) +
        (record.travelAllowance || 0) +
        (record.otherAllowances || 0) +
        (record.overtimeAmount || 0) +
        (record.performanceBonus || 0) +
        (record.festivalBonus || 0) +
        (record.otherBonuses || 0);

      const deductions =
        (record.providentFund || 0) +
        (record.taxDeduction || 0) +
        (record.otherDeductions || 0);

      const netSalary = earnings - deductions;

      return {
        ...record,
        earnings: earnings.toFixed(2),
        deductions: deductions.toFixed(2),
        netSalary: netSalary.toFixed(2),
      };
    });

    // Monthly salary trend
    const monthlySalary = await Salary.findAll({
      attributes: [
        "salaryMonth",
        "salaryYear",
        [sequelize.fn("COUNT", sequelize.col("id")), "employeeCount"],
        [sequelize.fn("SUM", sequelize.col("basicSalary")), "totalBasic"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              "basicSalary + houseRent + medicalAllowance + travelAllowance + otherAllowances",
            ),
          ),
          "totalGross",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("providentFund + taxDeduction + otherDeductions"),
          ),
          "totalDeductions",
        ],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal(
              "basicSalary + houseRent + medicalAllowance + travelAllowance + otherAllowances - providentFund - taxDeduction - otherDeductions",
            ),
          ),
          "avgNetSalary",
        ],
      ],
      group: ["salaryMonth", "salaryYear"],
      order: [
        ["salaryYear", "DESC"],
        ["salaryMonth", "DESC"],
      ],
      limit: 12,
    });

    // Department-wise salary summary (simplified without include)
    const departmentSalaryData = await Salary.findAll({
      attributes: [
        "department", // Use the department field from Salary model
        [sequelize.fn("COUNT", sequelize.col("id")), "employeeCount"],
        [sequelize.fn("SUM", sequelize.col("basicSalary")), "totalBasic"],
        [sequelize.fn("AVG", sequelize.col("basicSalary")), "avgBasic"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              "basicSalary + houseRent + medicalAllowance + travelAllowance + otherAllowances",
            ),
          ),
          "totalGross",
        ],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal(
              "basicSalary + houseRent + medicalAllowance + travelAllowance + otherAllowances",
            ),
          ),
          "avgGross",
        ],
      ],
      group: ["department"],
      raw: true,
    });

    // Payment method distribution
    const paymentMethodDistribution = await Salary.findAll({
      where: whereClause,
      attributes: [
        "paymentMethod",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              "basicSalary + houseRent + medicalAllowance + travelAllowance + otherAllowances - providentFund - taxDeduction - otherDeductions",
            ),
          ),
          "totalAmount",
        ],
      ],
      group: ["paymentMethod"],
    });

    const totalPages = Math.ceil(count / limitNumber);

    // Calculate totals
    const totals = {
      totalEmployees: filteredRecords.length,
      totalBasic: salaryStats.reduce(
        (sum, stat) => sum + parseFloat(stat.totalBasic || 0),
        0,
      ),
      totalGross: salaryStats.reduce(
        (sum, stat) =>
          sum +
          parseFloat(stat.totalBasic || 0) +
          parseFloat(stat.totalHouseRent || 0) +
          parseFloat(stat.totalMedical || 0) +
          parseFloat(stat.totalTravel || 0) +
          parseFloat(stat.totalOtherAllowances || 0),
        0,
      ),
      totalDeductions: salaryStats.reduce(
        (sum, stat) =>
          sum + parseFloat(stat.totalPF || 0) + parseFloat(stat.totalTax || 0),
        0,
      ),
      totalNet: recordsWithNetSalary.reduce(
        (sum, record) => sum + parseFloat(record.netSalary || 0),
        0,
      ),
      paidAmount: recordsWithNetSalary
        .filter((record) => record.paymentStatus === "paid")
        .reduce((sum, record) => sum + parseFloat(record.netSalary || 0), 0),
      pendingAmount: recordsWithNetSalary
        .filter((record) => record.paymentStatus === "pending")
        .reduce((sum, record) => sum + parseFloat(record.netSalary || 0), 0),
    };

    res.status(200).json({
      success: true,
      data: {
        salaryRecords: recordsWithNetSalary,
        statistics: {
          salaryStats,
          monthlySalary,
          departmentSalary: departmentSalaryData, // Changed variable name
          paymentMethodDistribution,
        },
        totals,
      },
      pagination: {
        totalItems: filteredRecords.length,
        totalPages: Math.ceil(filteredRecords.length / limitNumber),
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in salary payment report:", error);
    next(error);
  }
};

module.exports = {
  getEmployeeAttendanceReport,
  getSalaryPaymentReport,
};
